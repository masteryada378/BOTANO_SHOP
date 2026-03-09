/**
 * Модель картки товару.
 *
 * category — опціональне: існуючі товари не мають категорії (NULL у БД),
 * тому поле nullable, щоб не зламати роботу каталогу для старих записів.
 */
export interface Card {
    id: number;
    title: string;
    price: number;
    image?: string;
    category?: string | null;
}
