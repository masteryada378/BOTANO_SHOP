/**
 * CartItem — модель позиції в кошику.
 *
 * Чому окремий файл, а не в Card.ts?
 * — Card — модель товару з бекенду (що є у БД).
 *   CartItem — модель того, що юзер поклав у кошик: price snapshot,
 *   quantity. Різна відповідальність → різні файли (SRP).
 *
 * Чому price snapshot, а не посилання на товар?
 * — Ціна товару може змінитися. Кошик має показувати ціну
 *   на момент додавання, а не поточну. Стандарт e-commerce.
 */
export interface CartItem {
    id: number;
    title: string;
    /** Ціна на момент додавання (snapshot) — не змінюється при зміні ціни товару */
    price: number;
    image?: string;
    quantity: number;
}
