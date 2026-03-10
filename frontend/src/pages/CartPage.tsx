/**
 * CartPage — сторінка кошика (/cart).
 *
 * Мета: дати юзеру інтерфейс для перегляду і редагування кошика
 * перед переходом до оформлення замовлення.
 *
 * Layout:
 * — Mobile: одна колонка (список зверху, Order Summary знизу).
 * — Desktop (md+): grid [1fr 320px] — список ліворуч, summary праворуч (sticky).
 *
 * Стан "порожній кошик":
 * — Friendly повідомлення + кнопка переходу до каталогу.
 *   Порожня сторінка без пояснень — поганий UX (збільшує bounce rate).
 */

import { Link } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CartItemRow } from "../components/CartItemRow";
import { useAppContext } from "../context/AppContext";
import { formatPrice } from "../lib/formatPrice";
import { pluralizeUk } from "../lib/pluralize";

export const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } =
        useAppContext();

    const isEmpty = cart.length === 0;

    // ── Empty state ────────────────────────────────────────────────────────
    if (isEmpty) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="mb-6">
                    <Breadcrumbs
                        items={[
                            { label: "Головна", to: "/" },
                            { label: "Кошик" },
                        ]}
                    />
                </div>

                <h1 className="mb-8 text-2xl font-bold text-white">Кошик</h1>

                {/* Порожній стан — не blank page, а чітке повідомлення + CTA */}
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <ShoppingCart
                        className="h-20 w-20 text-gray-700"
                        aria-hidden="true"
                    />
                    <h2 className="text-xl font-semibold text-gray-300">
                        Ваш кошик порожній
                    </h2>
                    <p className="text-sm text-gray-500">
                        Додайте товари з каталогу
                    </p>
                    <Link
                        to="/catalog"
                        className="mt-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                    >
                        Перейти до каталогу
                    </Link>
                </div>
            </main>
        );
    }

    // ── Filled cart ────────────────────────────────────────────────────────
    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Головна", to: "/" },
                        { label: "Кошик" },
                    ]}
                />
            </div>

            {/* Заголовок з лічильником */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-white">
                    Кошик{" "}
                    <span className="text-lg font-normal text-gray-400">
                        ({pluralizeUk(totalItems, "товар", "товари", "товарів")})
                    </span>
                </h1>

                {/* Очистити кошик — деструктивна дія, тому red hover */}
                <button
                    type="button"
                    onClick={clearCart}
                    className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Очистити кошик
                </button>
            </div>

            {/*
             * Desktop: grid [1fr 320px] — список і summary поруч.
             * Mobile: block (summary йде після списку).
             */}
            <div className="grid gap-8 md:grid-cols-[1fr_320px]">

                {/* ── Список товарів ──────────────────────────────────── */}
                <section aria-label="Товари в кошику">
                    <ul
                        className="divide-y divide-gray-800"
                        aria-label="Список товарів"
                    >
                        {cart.map((item) => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </ul>

                    {/* Продовжити покупки */}
                    <div className="mt-6">
                        <Link
                            to="/catalog"
                            className="text-sm text-violet-400 transition-colors hover:text-violet-300"
                        >
                            ← Продовжити покупки
                        </Link>
                    </div>
                </section>

                {/* ── Order Summary ───────────────────────────────────── */}
                {/*
                 * md:sticky md:top-24 — "липне" до верху viewport при скролі на desktop.
                 * Кнопка "Оформити" завжди видима поряд зі списком.
                 */}
                <aside
                    aria-label="Підсумок замовлення"
                    className="md:sticky md:top-24 h-fit rounded-xl border border-gray-800 bg-gray-900 p-6"
                >
                    <h2 className="mb-4 text-lg font-semibold text-white">
                        Підсумок
                    </h2>

                    {/* Кількість позицій */}
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                        <span>
                            {pluralizeUk(cart.length, "позиція", "позиції", "позицій")}
                        </span>
                        <span>{cart.length}</span>
                    </div>

                    {/* Кількість одиниць */}
                    <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
                        <span>Одиниць товару</span>
                        <span>{totalItems}</span>
                    </div>

                    {/* Роздільник */}
                    <div className="mb-4 border-t border-gray-700" />

                    {/* Загальна сума */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="font-semibold text-white">Разом:</span>
                        {/*
                         * font-mono + emerald-400 — "гік-акцент" для ціни,
                         * той самий стиль що й на PDP (єдина дизайн-система).
                         */}
                        <span className="font-mono text-xl font-bold text-emerald-400">
                            {formatPrice(totalPrice)}
                        </span>
                    </div>

                    {/* CTA — перехід до оформлення */}
                    <Link
                        to="/checkout"
                        className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-500"
                    >
                        Оформити замовлення
                    </Link>

                    <p className="mt-3 text-center text-xs text-gray-500">
                        Безпечне оформлення
                    </p>
                </aside>
            </div>
        </main>
    );
};
