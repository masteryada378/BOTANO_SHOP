/**
 * OrderHistory — список замовлень авторизованого юзера з можливістю
 * розгортання деталей кожного замовлення.
 *
 * Чому компонент сам завантажує дані, а не отримує через props?
 * — OrderHistory — "smart component": він відповідає за одну відокремлену
 *   фічу (список замовлень). ProfilePage не повинна знати деталі завантаження.
 *   Це спрощує ProfilePage і робить OrderHistory перевикористовуваним.
 *
 * Чому expand через локальний стан, а не окрема сторінка?
 * — Деталі замовлення не потребують окремого URL для MVP.
 *   Inline expand швидший для юзера (не потрібна навігація назад).
 *
 * Три стани списку:
 *   1. isLoading — skeleton-анімація (не пустий екран).
 *   2. error — повідомлення + кнопка "Спробувати ще".
 *   3. orders.length === 0 — empty state з CTA до каталогу.
 *   4. data — список OrderRow.
 */

import { useState, useEffect, useCallback } from "react";
import {
    Package,
    ChevronDown,
    ChevronUp,
    RefreshCcw,
    ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchOrders, fetchOrderById } from "../services/orderService";
import { formatPrice } from "../lib/formatPrice";
import type { OrderSummary, OrderDetail } from "../types/order";
import { ORDER_STATUS_MAP } from "../types/order";

/** Кількість skeleton-рядків під час завантаження */
const SKELETON_COUNT = 3;

/**
 * Skeleton-заповнювач одного рядка замовлення.
 * animate-pulse — стандартний Tailwind-клас для пульсуючої анімації.
 * Показує структуру до завантаження, без "стрибка" контенту.
 */
const OrderSkeleton = () => (
    <li className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 animate-pulse">
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
                <div className="h-4 w-24 rounded bg-gray-700" />
                <div className="h-3 w-32 rounded bg-gray-700" />
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-700" />
            <div className="h-4 w-16 rounded bg-gray-700" />
        </div>
    </li>
);

/**
 * Badge статусу замовлення.
 * Колір береться з ORDER_STATUS_MAP — один джерело правди для кольорів.
 * Fallback: якщо статус невідомий — сірий колір, щоб не крашити UI.
 */
const StatusBadge = ({ status }: { status: string }) => {
    const statusInfo = ORDER_STATUS_MAP[status] ?? {
        label: status,
        color: "bg-gray-500/20 text-gray-400",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
        >
            {statusInfo.label}
        </span>
    );
};

/**
 * Розгорнуті деталі замовлення — список позицій + контакт/доставка/оплата.
 * Рендериться тільки після успішного fetchOrderById (lazy load при expand).
 *
 * delivery_address — опціональне: при самовивозі може бути порожнім.
 * Умовний рендер <> не показує порожній рядок у dl.
 */
const OrderDetailView = ({ detail }: { detail: OrderDetail }) => (
    <div className="mt-4 border-t border-gray-700 pt-4 space-y-4">
        {/* Список позицій: назва × кількість = subtotal */}
        <ul className="space-y-2">
            {detail.items.map((item) => (
                <li
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                >
                    <span className="text-gray-300">
                        {item.title}{" "}
                        <span className="text-gray-500">× {item.quantity}</span>
                    </span>
                    {/* Subtotal за позицією: ціна × кількість */}
                    <span className="text-gray-200 font-medium tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                    </span>
                </li>
            ))}
        </ul>

        {/* Контактна інформація та спосіб доставки/оплати */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-gray-500">Отримувач</dt>
            <dd className="text-gray-300">{detail.customer_name}</dd>

            <dt className="text-gray-500">Телефон</dt>
            <dd className="text-gray-300">{detail.customer_phone}</dd>

            <dt className="text-gray-500">Доставка</dt>
            <dd className="text-gray-300">{detail.delivery_method}</dd>

            {/* Адреса відсутня при самовивозі — не рендеримо порожній рядок */}
            {detail.delivery_address && (
                <>
                    <dt className="text-gray-500">Адреса</dt>
                    <dd className="text-gray-300">{detail.delivery_address}</dd>
                </>
            )}

            <dt className="text-gray-500">Оплата</dt>
            <dd className="text-gray-300">{detail.payment_method}</dd>
        </dl>
    </div>
);

/**
 * Один рядок замовлення — заголовок + expandable деталі.
 *
 * Стратегія завантаження деталей:
 * — Перший expand → fetchOrderById → кешуємо у detail state.
 * — Повторний expand → відображаємо з кешу (detail != null → skip fetch).
 * — useCallback для handleToggle — стабільна референція, бо передається у JSX onClick.
 *
 * aria-expanded — доступність: скрін-рідер озвучить стан кнопки.
 */
const OrderRow = ({ order }: { order: OrderSummary }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    /** Кешовані деталі — завантажуються один раз при першому expand */
    const [detail, setDetail] = useState<OrderDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState(false);

    /**
     * Завантажуємо деталі тільки при першому expand (lazy loading).
     * Якщо вже завантажили — просто відображаємо з кешу (detail state).
     */
    const handleToggle = useCallback(async () => {
        if (isExpanded) {
            setIsExpanded(false);
            return;
        }

        setIsExpanded(true);

        // Деталі вже завантажені — повторний запит не потрібен
        if (detail) return;

        setIsLoadingDetail(true);
        setDetailError(false);

        try {
            const data = await fetchOrderById(order.id);
            setDetail(data);
        } catch {
            setDetailError(true);
        } finally {
            setIsLoadingDetail(false);
        }
    }, [isExpanded, detail, order.id]);

    const formattedDate = new Date(order.created_at).toLocaleDateString(
        "uk-UA",
        { day: "2-digit", month: "long", year: "numeric" },
    );

    return (
        <li className="rounded-xl border border-gray-700 bg-gray-800/50 transition-colors hover:border-gray-600">
            {/* Заголовок замовлення — завжди видимий, кліком відкриває деталі */}
            <button
                onClick={handleToggle}
                className="w-full flex items-center justify-between gap-3 p-4 text-left"
                aria-expanded={isExpanded}
            >
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* font-mono для ID — щоб числа виглядали як код/ID */}
                        <span className="font-mono text-sm font-semibold text-violet-400">
                            #{order.id}
                        </span>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {formattedDate} ·{" "}
                        {order.items_count}{" "}
                        {order.items_count === 1 ? "товар" : "товари"}
                    </p>
                </div>

                {/* tabular-nums — цифри однакової ширини, сума не "стрибає" */}
                <span className="shrink-0 font-mono text-sm font-semibold text-gray-200 tabular-nums">
                    {formatPrice(order.total_price)}
                </span>

                {/* Іконка стану expand — ChevronUp/Down як візуальний індикатор */}
                {isExpanded ? (
                    <ChevronUp size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
                ) : (
                    <ChevronDown size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
                )}
            </button>

            {/* Деталі — рендеруються тільки при isExpanded */}
            {isExpanded && (
                <div className="px-4 pb-4">
                    {/* Thin loading bar під час завантаження деталей */}
                    {isLoadingDetail && (
                        <div className="h-1 w-full rounded bg-gray-700 animate-pulse" />
                    )}
                    {detailError && (
                        <p className="text-sm text-red-400">
                            Не вдалося завантажити деталі. Спробуй ще раз.
                        </p>
                    )}
                    {detail && <OrderDetailView detail={detail} />}
                </div>
            )}
        </li>
    );
};

/**
 * Основний компонент — завантажує список замовлень і рендерить OrderRow для кожного.
 *
 * useCallback для loadOrders — стабільна референція для useEffect dependency array.
 * Без useCallback — нескінченний re-render через нову функцію при кожному рендері.
 */
export const OrderHistory = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(false);

        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Завантажуємо замовлення при першому рендері компонента
    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Стан 1: завантаження — skeleton замість пустого екрану
    if (isLoading) {
        return (
            <ul className="space-y-3" aria-label="Завантаження замовлень">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <OrderSkeleton key={i} />
                ))}
            </ul>
        );
    }

    // Стан 2: помилка — повідомлення + кнопка retry
    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
                <Package size={48} className="text-gray-600" aria-hidden="true" />
                <p className="text-gray-400">Не вдалося завантажити замовлення.</p>
                <button
                    onClick={loadOrders}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                >
                    <RefreshCcw size={14} aria-hidden="true" />
                    Спробувати ще
                </button>
            </div>
        );
    }

    // Стан 3: порожній список — CTA-кнопка до каталогу
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
                <ShoppingBag size={48} className="text-gray-600" aria-hidden="true" />
                <p className="text-gray-300 font-medium">
                    У вас ще немає замовлень
                </p>
                <p className="text-gray-500 text-sm">
                    Зробіть своє перше замовлення!
                </p>
                <Link
                    to="/catalog"
                    className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                >
                    До каталогу
                </Link>
            </div>
        );
    }

    // Стан 4: список замовлень — семантичний <ul> + <li> через OrderRow
    return (
        <ul className="space-y-3" aria-label="Список замовлень">
            {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
            ))}
        </ul>
    );
};
