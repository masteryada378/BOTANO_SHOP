/**
 * Типи для роботи із замовленнями на фронтенді.
 *
 * Чому окремий файл?
 * — SRP: Cart.ts — для кошика, order.ts — для замовлень.
 *   Ці домени мають різний lifecycle: кошик живе у пам'яті/localStorage,
 *   замовлення — постійні записи у БД.
 *
 * Чому не об'єднати з checkout.ts?
 * — CheckoutFormData описує INPUT форми (що юзер вводить),
 *   OrderSummary/OrderDetail описують OUTPUT від API (що повертає бекенд).
 *   Різні контракти — різні файли.
 */

/**
 * Короткий опис замовлення для відображення у списку (OrderHistory).
 * Повертається з GET /orders.
 *
 * items_count — агрегат із SQL COUNT(order_items.id),
 * щоб не завантажувати повний масив items у списку.
 */
export interface OrderSummary {
    id: number;
    total_price: number;
    /** Значення з ORDER_STATUS_MAP: pending | confirmed | shipped | completed */
    status: string;
    /** ISO-рядок дати, наприклад "2024-12-01T10:30:00.000Z" */
    created_at: string;
    /** Кількість позицій — повертається з COUNT(oi.id) у SQL-запиті */
    items_count: number;
}

/**
 * Повний опис замовлення з позиціями.
 * Завантажується по кліку на expand (GET /orders/:id).
 *
 * Extends OrderSummary — щоб не дублювати спільні поля.
 * Бекенд повертає items + контактні дані одним запитом із JOIN.
 */
export interface OrderDetail extends OrderSummary {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    /** Нова Пошта | Кур'єр | Самовивіз */
    delivery_method: string;
    /** Може бути порожнім при самовивозі */
    delivery_address: string;
    /** Картка | Готівка | Накладений платіж */
    payment_method: string;
    items: OrderDetailItem[];
}

/**
 * Одна позиція в замовленні.
 * price — ціна на момент замовлення (знімок), не поточна ціна товару.
 * Це важливо: ціна товару може змінитися після замовлення.
 */
export interface OrderDetailItem {
    id: number;
    product_id: number;
    title: string;
    /** Ціна на момент замовлення (не поточна ціна товару) */
    price: number;
    quantity: number;
}

/**
 * Маппінг статусів замовлення → локалізований текст + Tailwind-класи кольору.
 *
 * Чому Record, а не switch у компоненті?
 * — Декларативне визначення в одному місці: і label, і колір.
 *   Додавання нового статусу — один рядок тут, без змін у компонентах.
 *
 * Чому саме ці кольори?
 * — pending (жовтий) — очікування; confirmed (синій) — підтвердження;
 *   shipped (фіолетовий) — в дорозі; completed (зелений) — завершено.
 *   Відповідає стандартному e-commerce UX патерну.
 *
 * Fallback у StatusBadge: якщо статус не знайдено — сірий колір.
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
