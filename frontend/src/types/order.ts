/**
 * Типи для роботи із замовленнями на фронтенді.
 *
 * Чому окремий файл?
 * — SRP: Cart.ts — для кошика, order.ts — для замовлень.
 *   Ці домени мають різний lifecycle: кошик живе у пам'яті/localStorage,
 *   замовлення — постійні записи у БД.
 */

/** Короткий опис замовлення для списку в OrderHistory */
export interface OrderSummary {
    id: number;
    total_price: number;
    status: string;
    created_at: string;
    /** Кількість позицій — повертається з COUNT(oi.id) у SQL-запиті */
    items_count: number;
}

/** Повний опис замовлення з позиціями (завантажується по кліку на expand) */
export interface OrderDetail extends OrderSummary {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_method: string;
    delivery_address: string;
    payment_method: string;
    items: OrderDetailItem[];
}

/** Одна позиція в замовленні */
export interface OrderDetailItem {
    id: number;
    product_id: number;
    title: string;
    price: number;
    quantity: number;
}

/**
 * Маппінг статусів замовлення → локалізований текст + Tailwind-класи кольору.
 *
 * Чому Record, а не switch у компоненті?
 * — Декларативне визначення в одному місці: і label, і колір.
 *   Додавання нового статусу — один рядок тут, без змін у компонентах.
 */
export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> =
    {
        pending: { label: "Очікує", color: "bg-yellow-500/20 text-yellow-400" },
        confirmed: {
            label: "Підтверджено",
            color: "bg-blue-500/20 text-blue-400",
        },
        shipped: {
            label: "Відправлено",
            color: "bg-violet-500/20 text-violet-400",
        },
        completed: {
            label: "Виконано",
            color: "bg-emerald-500/20 text-emerald-400",
        },
    };
