/**
 * Сервіс для роботи з ресурсом /orders.
 *
 * Чому окремий сервіс?
 * — SRP: компонент рендерить UI, сервіс — транспорт (HTTP).
 *   Якщо ендпоінт зміниться — правимо тут, а не у JSX.
 */

import { apiPost } from "./api";
import type { CartItem } from "../types/Cart";
import type { CheckoutFormData } from "../types/checkout";

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
