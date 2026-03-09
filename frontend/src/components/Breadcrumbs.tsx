/**
 * Breadcrumbs — універсальний навігаційний ланцюжок ("хлібні крихти").
 *
 * Чому він потрібен?
 * — Юзер на сторінці товару не знає де він у структурі сайту.
 *   Breadcrumbs показують ієрархію і дозволяють повернутися на рівень вище.
 *
 * Семантика (SEO + a11y):
 * — <nav aria-label="..."> — landmark для screen readers.
 * — <ol> — упорядкований список (порядок крихт має значення).
 * — aria-current="page" — позначає поточну сторінку (остання крихта).
 *   Screen reader оголошує "поточна сторінка: Назва товару".
 *
 * Структурні дані (Google rich snippets):
 * — Щоб Google показував breadcrumbs у пошуку, достатньо семантичної розмітки.
 *   JSON-LD можна додати пізніше окремим компонентом без змін тут.
 */

import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import type { BreadcrumbItem } from "../types/catalog";

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    if (items.length === 0) return null;

    return (
        /*
         * aria-label="Навігаційний шлях" — описовий атрибут для screen readers.
         * Не "breadcrumbs" — бо це жаргон, а не зрозуміла назва для користувачів.
         */
        <nav aria-label="Навігаційний шлях">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-1">
                            {/* Роздільник між крихтами (не перед першою) */}
                            {!isFirst && (
                                <ChevronRight
                                    size={14}
                                    className="shrink-0 text-gray-600"
                                    aria-hidden="true"
                                />
                            )}

                            {/*
                             * Перший елемент ("Головна") отримує іконку Home для компактності на мобілці.
                             * Іконка + текст — краще, ніж тільки текст (зрозуміло без читання).
                             */}
                            {isFirst && (
                                <Home
                                    size={14}
                                    className="shrink-0"
                                    aria-hidden="true"
                                />
                            )}

                            {isLast ? (
                                /*
                                 * Остання крихта — поточна сторінка.
                                 * НЕ є посиланням (не має сенсу посилатися на поточну сторінку).
                                 * aria-current="page" сигналізує screen reader про поточне місце.
                                 * truncate max-w-[180px] — довга назва товару не ламає layout.
                                 */
                                <span
                                    aria-current="page"
                                    className="truncate max-w-[180px] text-gray-200 sm:max-w-xs"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                /*
                                 * Проміжні крихти — активні посилання.
                                 * hover:text-violet-400 — фірмовий акцент при hover.
                                 */
                                <Link
                                    to={item.to ?? "/"}
                                    className="hover:text-violet-400 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
