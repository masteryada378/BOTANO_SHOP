/**
 * Сервіс для роботи з ресурсом /orders.
 *
 * Чому окремий сервіс?
 * — SRP: компонент рендерить UI, сервіс — транспорт (HTTP).
 *   Якщо ендпоінт зміниться — правимо тут, а не у JSX.
 *
 * Чому не в api.ts?
 * — api.ts — низькорівневий клієнт (request, apiGet, apiPost).
 *   orderService.ts — бізнес-логіка: знає про структуру замовлення,
 *   формує правильний body, типізує відповідь.
 */

import { apiGet, apiPost } from "./api";
import type { CartItem } from "../types/Cart";
import type { CheckoutFormData } from "../types/checkout";
import type { OrderDetail, OrderSummary } from "../types/order";

/** Відповідь бекенду на успішне створення замовлення */
export interface CreateOrderResponse {
    id: number;
    status: string;
}

/**
 * Створити замовлення.
 * Збирає дані форми + items з кошика → POST /orders.
 *
 * Чому items передаються явно, а не береться з контексту?
 * — Сервіс не знає про React Context — залежність від фреймворку у шарі services
 *   порушує принцип розподілу відповідальностей. Caller (компонент) передає дані явно.
 *
 * Чому перетворюємо cartItems → items?
 * — CartItem має поля, які не потрібні бекенду (наприклад, imageUrl, category).
 *   Передаємо тільки те, що потрібно: product_id, title, price, quantity.
 *   Це зменшує payload і відокремлює контракт API від внутрішньої структури кошика.
 */
export const createOrder = (
    formData: CheckoutFormData,
    cartItems: CartItem[],
): Promise<CreateOrderResponse> => {
    const body = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail,
        delivery_method: formData.deliveryMethod,
        delivery_address: formData.deliveryAddress,
        payment_method: formData.paymentMethod,
        items: cartItems.map((item) => ({
            product_id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
        })),
    };

    return apiPost<CreateOrderResponse>("/orders", body);
};

/**
 * Отримати список замовлень авторизованого юзера.
 * GET /orders — захищений ендпоінт (authMiddleware на бекенді).
 *
 * Токен автоматично додається у request() з localStorage —
 * не потрібно передавати його явно тут.
 *
 * Повертає масив OrderSummary (без items) — для швидкого списку.
 * Деталі завантажуються окремо через fetchOrderById при expand.
 */
export const fetchOrders = (): Promise<OrderSummary[]> => apiGet("/orders");

/**
 * Отримати деталі одного замовлення з позиціями.
 * GET /orders/:id — бекенд перевіряє ownership:
 * юзер бачить тільки свої замовлення (403/404 для чужих).
 *
 * Чому lazy loading, а не завантажити всі деталі одразу?
 * — При 10+ замовленнях завантаження всіх деталей одразу — зайве навантаження.
 *   Юзер часто переглядає лише 1-2 замовлення з усього списку.
 */
export const fetchOrderById = (id: number): Promise<OrderDetail> =>
    apiGet(`/orders/${id}`);
