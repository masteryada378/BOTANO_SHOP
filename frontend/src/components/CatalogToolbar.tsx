/**
 * CatalogToolbar — панель керування каталогом.
 *
 * Відповідальність (SRP):
 * - Відображає кількість знайдених товарів.
 * - Надає <select> для вибору сортування.
 * - Рендерить кнопку "Фільтри" (тригер для майбутнього drawer у Task #13).
 *
 * Чому не тримаємо стан тут?
 * — Toolbar — "презентаційний" компонент: отримує дані через props,
 *   повідомляє батька через колбеки. CatalogPage керує станом і URL.
 */

import { SlidersHorizontal } from "lucide-react";
import { pluralizeUk } from "../lib/pluralize";
import { SORT_OPTIONS } from "../types/catalog";
import type { SortOption } from "../types/catalog";

interface CatalogToolbarProps {
    /** Загальна кількість товарів для лічильника */
    totalCount: number | null;
    /** Поточне значення сортування */
    currentSort: SortOption;
    /** Колбек при зміні сортування */
    onSortChange: (sort: SortOption) => void;
    /** Колбек для кнопки "Фільтри" (drawer буде реалізований у Task #13) */
    onFilterClick: () => void;
}

export const CatalogToolbar = ({
    totalCount,
    currentSort,
    onSortChange,
    onFilterClick,
}: CatalogToolbarProps) => {
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
                 * Кнопка "Фільтри" — поки лише тригер (без drawer).
                 * Task #13 підключить реальний filter drawer.
                 */}
                <button
                    type="button"
                    onClick={onFilterClick}
                    aria-label="Відкрити фільтри"
                    className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                    Фільтри
                </button>
            </div>
        </div>
    );
};
