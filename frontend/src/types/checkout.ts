/**
 * Типи та константи для сторінки Checkout.
 *
 * Чому as const для масивів?
 * — Вузький тип (literal union) замість string[].
 *   TypeScript ловитиме спроби передати невалідний метод доставки/оплати.
 *
 * Чому delivery_address опціональний при pickup?
 * — При самовивозі адреса не потрібна. Це відображено у логіці валідації хука useCheckoutForm.
 */

export interface CheckoutFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryMethod: string;
    deliveryAddress: string;
    paymentMethod: string;
}

export const DELIVERY_METHODS = [
    { value: "nova_poshta", label: "Нова Пошта (відділення)" },
    { value: "nova_poshta_courier", label: "Нова Пошта (кур'єр)" },
    { value: "ukrposhta", label: "Укрпошта" },
    { value: "pickup", label: "Самовивіз" },
] as const;

export const PAYMENT_METHODS = [
    { value: "card_on_delivery", label: "Картою при отриманні" },
    { value: "cash_on_delivery", label: "Готівкою при отриманні" },
    { value: "card_online", label: "Оплата онлайн (картка)" },
] as const;

/** Порожній стан форми — для ініціалізації useState */
export const INITIAL_FORM_DATA: CheckoutFormData = {
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryMethod: "",
    deliveryAddress: "",
    paymentMethod: "",
};
