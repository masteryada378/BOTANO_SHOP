/**
 * CatalogToolbar — панель керування каталогом.
 *
 * Відповідальність (SRP):
 * - Відображає кількість знайдених товарів.
 * - Надає <select> для вибору сортування.
 * - Рендерить кнопку "Фільтри" з badge кількості активних фільтрів.
 *
 * Чому не тримаємо стан тут?
 * — Toolbar — "презентаційний" компонент: отримує дані через props,
 *   повідомляє батька через колбеки. CatalogPage керує станом і URL.
 */

import { SlidersHorizontal } from "lucide-react";
import { pluralizeUk } from "../lib/pluralize";
import { SORT_OPTIONS } from "../types/catalog";
import type { CatalogFilters, SortOption } from "../types/catalog";

interface CatalogToolbarProps {
    /** Загальна кількість товарів для лічильника */
    totalCount: number | null;
    /** Поточне значення сортування */
    currentSort: SortOption;
    /** Поточні активні фільтри — для підрахунку badge */
    activeFilters: CatalogFilters;
    /** Колбек при зміні сортування */
    onSortChange: (sort: SortOption) => void;
    /** Колбек для кнопки "Фільтри" — відкриває drawer */
    onFilterClick: () => void;
}

/**
 * Підраховує кількість активних (непустих) фільтрів.
 *
 * Чому окрема функція, а не inline у JSX?
 * — Логіку легше тестувати і читати окремо від розмітки.
 */
const countActiveFilters = (filters: CatalogFilters): number =>
    Object.values(filters).filter((v) => v !== undefined && v !== "").length;

export const CatalogToolbar = ({
    totalCount,
    currentSort,
    activeFilters,
    onSortChange,
    onFilterClick,
}: CatalogToolbarProps) => {
    const activeCount = countActiveFilters(activeFilters);

    return (
        <div
            className="flex items-center justify-between gap-2 py-3"
            aria-label="Панель інструментів каталогу"
        >
            {/* Лічильник результатів */}
            <p className="text-sm text-gray-400" aria-live="polite">
                {totalCount === null
                    ? "Завантаження..."
                    : pluralizeUk(totalCount, "товар", "товари", "товарів")}
            </p>

            {/* Сортування + кнопка фільтрів — групуємо праворуч */}
            <div className="flex items-center gap-2">
                {/*
                 * Нативний <select> замість кастомного dropdown:
                 * — Доступний з коробки (a11y, мобільний picker).
                 * — Не потребує зовнішньої бібліотеки.
                 */}
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    aria-label="Сортування товарів"
                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/*
                 * Кнопка "Фільтри" з badge активних фільтрів.
                 *
                 * Badge: violet підсвітка коли є активні фільтри — юзер бачить,
                 * що фільтрація застосована, навіть коли drawer закритий.
                 */}
                <button
                    type="button"
                    onClick={onFilterClick}
                    aria-label={
                        activeCount > 0
                            ? `Відкрити фільтри (${activeCount} активних)`
                            : "Відкрити фільтри"
                    }
                    className={[
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                        activeCount > 0
                            ? "border-violet-500 bg-violet-600/20 text-violet-300 hover:bg-violet-600/30"
                            : "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700",
                    ].join(" ")}
                >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                    Фільтри
                    {/* Badge — відображається тільки при наявності активних фільтрів */}
                    {activeCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white"
                        >
                            {activeCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
