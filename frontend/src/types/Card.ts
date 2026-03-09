/**
 * Модель картки товару.
 *
 * Всі поля, що додані після початкового релізу (category, description, brand,
 * old_price, in_stock), — опціональні або nullable. Це гарантує зворотну
 * сумісність: старі записи без цих полів продовжують коректно рендеритись
 * в CatalogCard і SearchSuggestions без помилок TypeScript.
 */
export interface Card {
    id: number;
    title: string;
    price: number;
    image?: string;
    category?: string | null;
    /** Розгорнутий опис товару — використовується на сторінці деталей (PDP) */
    description?: string | null;
    /** Бренд/виробник (Marvel, Funko Pop, Nintendo тощо) */
    brand?: string | null;
    /** Ціна до знижки; присутня тільки коли є акція */
    old_price?: number | null;
    /** Статус наявності; true = є в наявності, false = під замовлення */
    in_stock?: boolean;
}
