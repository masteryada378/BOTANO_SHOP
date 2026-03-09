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

/**
 * Об'єкт фільтрів каталогу.
 *
 * Всі поля string (не number), бо читаються з URL через URLSearchParams.get(),
 * яка завжди повертає string | null. Конвертація в number — відповідальність бекенду.
 */
export interface CatalogFilters {
    min_price?: string;
    max_price?: string;
    category?: string;
}

/**
 * Список категорій товарів.
 *
 * Чому хардкод, а не API?
 * — Категорії змінюються рідко, окремий endpoint надлишковий на цьому етапі.
 *   Пізніше можна замінити на GET /categories без зміни компонентів.
 *
 * `as const` — гарантує, що value/label є літеральними типами (не просто string).
 */
export const CATEGORIES = [
    { value: "comics", label: "Комікси" },
    { value: "figures", label: "Фігурки" },
    { value: "gadgets", label: "Девайси" },
    { value: "clothing", label: "Одяг" },
    { value: "accessories", label: "Аксесуари" },
] as const;

/** Тип значення категорії (union з масиву CATEGORIES) */
export type CategoryValue = (typeof CATEGORIES)[number]["value"];

/**
 * Один елемент ланцюжка breadcrumbs.
 *
 * Чому `to` опціональний?
 * — Останній елемент (поточна сторінка) НЕ є посиланням.
 *   Якщо `to` відсутній — рендеримо <span aria-current="page">.
 *   Це стандартний патерн для семантичних breadcrumbs (a11y + SEO).
 */
export interface BreadcrumbItem {
    label: string;
    to?: string;
}
