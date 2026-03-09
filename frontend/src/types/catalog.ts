/**
 * Типи та константи для сторінки каталогу.
 *
 * Чому тут, а не в компоненті?
 * — SortOption потрібен у трьох місцях: cardService, CatalogToolbar, CatalogPage.
 *   Один файл — одне місце для змін.
 */

/** Допустимі варіанти сортування каталогу */
export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

/**
 * Масив опцій для рендеру <select>.
 *
 * Чому масив, а не об'єкт?
 * — .map() по масиву гарантує порядок відображення опцій у <select>.
 *   Об'єкт порядок не гарантує (по стандарту ES).
 */
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Спочатку нові" },
    { value: "oldest", label: "Спочатку старі" },
    { value: "price_asc", label: "Від дешевих" },
    { value: "price_desc", label: "Від дорогих" },
];

/** Масив допустимих значень для валідації URL-параметра ?sort= */
export const VALID_SORT_VALUES: SortOption[] = SORT_OPTIONS.map((o) => o.value);
