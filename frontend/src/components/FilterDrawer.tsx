/**
 * FilterDrawer — висувна панель фільтрів каталогу (mobile-first).
 *
 * Чому drawer, а не sidebar?
 * — На мобілці фільтри не поміщаються у layout поруч із grid товарів.
 *   Drawer звільняє весь екран під контент і відкривається лише коли потрібно.
 *   Це стандартний патерн мобільних каталогів (Rozetka, Amazon, Zara).
 *
 * Чому локальний стан, а не відразу URL?
 * — Юзер має можливість "пограти" з фільтрами без перезавантаження даних.
 *   URL оновлюється тільки при натисканні "Застосувати" — одним запитом до API.
 *
 * Анімація:
 * — translate-x-full (прихований, справа) → translate-x-0 (видимий).
 *   transition-transform duration-300 ease-in-out — плавне з'їжджання.
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CatalogFilters } from "../types/catalog";
import { CATEGORIES } from "../types/catalog";

interface FilterDrawerProps {
    /** Чи відкритий drawer */
    isOpen: boolean;
    /** Колбек закриття (overlay, кнопка X, Escape) */
    onClose: () => void;
    /** Поточні активні фільтри (з URL) для ініціалізації локального стану */
    currentFilters: CatalogFilters;
    /** Колбек застосування фільтрів — викликається тільки при натисканні "Застосувати" */
    onApply: (filters: CatalogFilters) => void;
}

export const FilterDrawer = ({
    isOpen,
    onClose,
    currentFilters,
    onApply,
}: FilterDrawerProps) => {
    /**
     * Локальний стан фільтрів.
     *
     * Чому дублюємо currentFilters у локальний стан?
     * — Ізолюємо "чернетку" фільтрів від активних.
     *   При закритті без застосування — зміни скидаються до currentFilters.
     */
    const [localFilters, setLocalFilters] = useState<CatalogFilters>(currentFilters);

    /**
     * Синхронізуємо локальний стан коли drawer відкривається.
     *
     * Чому залежність від isOpen, а не currentFilters?
     * — Нас цікавить тільки момент відкриття: тоді заповнюємо форму актуальними
     *   значеннями з URL. При кожній зміні currentFilters оновлювати не потрібно
     *   (юзер може редагувати локальні фільтри незалежно від URL).
     */
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(currentFilters);
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Блокуємо scroll body поки drawer відкритий.
     *
     * Чому overflow-hidden на body?
     * — Без цього контент за drawer можна скролити, що заплутує юзера.
     *   Повертаємо auto у cleanup функції useEffect.
     */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    /**
     * Закрити drawer при натисканні Escape.
     *
     * Чому addEventListener, а не onKeyDown на елементі?
     * — Drawer може не мати фокусу. Document-рівень гарантує перехоплення
     *   Escape незалежно від того, який елемент активний.
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleApply = () => {
        onApply(localFilters);
    };

    const handleReset = () => {
        // Скидаємо і локальний стан, і передаємо порожній об'єкт батьку
        const empty: CatalogFilters = {};
        setLocalFilters(empty);
        onApply(empty);
    };

    return (
        <>
            {/*
             * Overlay — напівпрозорий фон за drawer.
             * pointer-events-none при закритому стані — не блокує кліки по контенту.
             * Клік по overlay закриває drawer (стандартна UX-поведінка).
             */}
            <div
                aria-hidden="true"
                onClick={onClose}
                className={[
                    "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                ].join(" ")}
            />

            {/*
             * Drawer панель.
             *
             * role="dialog" + aria-modal="true" — доступність: скрінрідер знає,
             * що це модальна панель, і обмежує навігацію всередині неї.
             *
             * translate-x-full (прихований справа) → translate-x-0 (видимий).
             * inset-y-0 right-0 — притиснуто до правого краю на повну висоту.
             */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Панель фільтрів"
                className={[
                    "fixed inset-y-0 right-0 z-50 flex flex-col",
                    "w-80 max-w-[85vw]",
                    "bg-gray-900 border-l border-gray-800",
                    "transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
            >
                {/* ── Header drawer ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                    <h2 className="text-base font-semibold text-gray-100">
                        Фільтри
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрити фільтри"
                        className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* ── Тіло drawer (скролиться якщо контент не поміщається) ── */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

                    {/* ── Секція "Ціна" ── */}
                    <section aria-labelledby="filter-price-heading">
                        <h3
                            id="filter-price-heading"
                            className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
                        >
                            Ціна, грн
                        </h3>
                        <div className="flex items-center gap-2">
                            {/*
                             * Два input type="number" замість range slider.
                             *
                             * Чому не range slider?
                             * — Кастомний range slider — складний компонент.
                             *   Прості inputs дають точний контроль і краще доступні.
                             *   Slider можна додати пізніше як покращення.
                             */}
                            <div className="flex-1">
                                <label
                                    htmlFor="filter-min-price"
                                    className="mb-1 block text-xs text-gray-500"
                                >
                                    Від
                                </label>
                                <input
                                    id="filter-min-price"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={localFilters.min_price ?? ""}
                                    onChange={(e) =>
                                        setLocalFilters((prev) => ({
                                            ...prev,
                                            min_price: e.target.value || undefined,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                                />
                            </div>

                            <span className="mt-5 text-gray-600" aria-hidden="true">—</span>

                            <div className="flex-1">
                                <label
                                    htmlFor="filter-max-price"
                                    className="mb-1 block text-xs text-gray-500"
                                >
                                    До
                                </label>
                                <input
                                    id="filter-max-price"
                                    type="number"
                                    min={0}
                                    placeholder="99999"
                                    value={localFilters.max_price ?? ""}
                                    onChange={(e) =>
                                        setLocalFilters((prev) => ({
                                            ...prev,
                                            max_price: e.target.value || undefined,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── Секція "Категорія" ── */}
                    <section aria-labelledby="filter-category-heading">
                        <h3
                            id="filter-category-heading"
                            className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400"
                        >
                            Категорія
                        </h3>

                        {/*
                         * Radio (одна категорія), а не checkbox (множинна).
                         *
                         * Чому radio?
                         * — Backend фільтрує через `category = ?` (рівність),
                         *   а не `category IN (...)`. Radio відповідає семантиці "одна умова".
                         *   Множинну фільтрацію можна додати пізніше разом зі зміною запиту.
                         *
                         * "Усі категорії" — явний вибір для скидання фільтра категорії.
                         */}
                        <fieldset>
                            <legend className="sr-only">Оберіть категорію</legend>
                            <div className="space-y-2">
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-800 transition-colors">
                                    <input
                                        type="radio"
                                        name="category"
                                        value=""
                                        checked={!localFilters.category}
                                        onChange={() =>
                                            setLocalFilters((prev) => ({
                                                ...prev,
                                                category: undefined,
                                            }))
                                        }
                                        className="h-4 w-4 accent-violet-500"
                                    />
                                    <span className="text-sm text-gray-300">Усі категорії</span>
                                </label>

                                {CATEGORIES.map((cat) => (
                                    <label
                                        key={cat.value}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-800 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.value}
                                            checked={localFilters.category === cat.value}
                                            onChange={() =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    category: cat.value,
                                                }))
                                            }
                                            className="h-4 w-4 accent-violet-500"
                                        />
                                        <span className="text-sm text-gray-300">{cat.label}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </section>
                </div>

                {/*
                 * Footer drawer — sticky внизу.
                 *
                 * Чому sticky footer?
                 * — Кнопки дії завжди видимі без скролу, навіть якщо фільтрів багато.
                 *   Стандарт мобільних форм.
                 */}
                <div className="border-t border-gray-800 px-5 py-4 space-y-2">
                    <button
                        type="button"
                        onClick={handleApply}
                        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                        Застосувати
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full rounded-xl py-2.5 text-sm text-gray-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                    >
                        Скинути фільтри
                    </button>
                </div>
            </div>
        </>
    );
};
