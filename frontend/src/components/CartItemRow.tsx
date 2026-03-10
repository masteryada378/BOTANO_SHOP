/**
 * CartItemRow — один рядок товару в кошику.
 *
 * Чому <li>, а не <div>?
 * — Семантика: список товарів є <ul>, кожен елемент — <li>.
 *   Скрін-рідери правильно оголошують "список з N елементів".
 *
 * UX-рішення:
 * — Кнопка "−" при quantity === 1 замінюється на Trash2 — explicit видалення.
 *   Юзер розуміє, що натискаючи на ікону смітника — видаляє товар.
 * — Зображення — клікабельне посилання на сторінку товару.
 * — Subtotal підсвічено emerald-400 (той самий колір що й ціна на PDP).
 */

import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ImageOff } from "lucide-react";
import type { CartItem } from "../types/Cart";
import { formatPrice } from "../lib/formatPrice";
import { cn } from "../lib/cn";

interface CartItemRowProps {
    item: CartItem;
    onUpdateQuantity: (id: number, qty: number) => void;
    onRemove: (id: number) => void;
}

export const CartItemRow = ({
    item,
    onUpdateQuantity,
    onRemove,
}: CartItemRowProps) => {
    const subtotal = item.price * item.quantity;
    const isLastUnit = item.quantity === 1;

    return (
        <li className="flex gap-3 py-4">
            {/* Зображення — посилання на PDP */}
            <Link
                to={`/product/${item.id}`}
                className="shrink-0"
                aria-label={`Переглянути ${item.title}`}
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover bg-gray-800"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-800">
                        <ImageOff
                            className="h-8 w-8 text-gray-600"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </Link>

            {/* Інформаційний блок */}
            <div className="flex flex-1 flex-col gap-2 min-w-0">
                {/* Назва та ціна за одиницю */}
                <div>
                    <p className="line-clamp-2 text-sm font-medium text-white leading-snug">
                        {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                        {formatPrice(item.price)} / шт.
                    </p>
                </div>

                {/* Нижній рядок: quantity controls + subtotal */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Контроли кількості */}
                    <div className="flex items-center gap-2">
                        {/*
                         * При quantity === 1: кнопка "−" стає Trash2.
                         * Юзер бачить явний сигнал "це видалить товар", а не просто зменшення.
                         */}
                        <button
                            type="button"
                            onClick={() =>
                                isLastUnit
                                    ? onRemove(item.id)
                                    : onUpdateQuantity(
                                          item.id,
                                          item.quantity - 1,
                                      )
                            }
                            aria-label={
                                isLastUnit
                                    ? `Видалити ${item.title} з кошика`
                                    : `Зменшити кількість ${item.title}`
                            }
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                "bg-gray-800 transition-colors",
                                isLastUnit
                                    ? "hover:bg-red-900/40 hover:text-red-400 text-gray-400"
                                    : "hover:bg-gray-700 text-gray-300",
                            )}
                        >
                            {isLastUnit ? (
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Minus className="h-4 w-4" aria-hidden="true" />
                            )}
                        </button>

                        <span
                            className="min-w-8 text-center text-sm font-medium text-white"
                            aria-live="polite"
                            aria-label={`Кількість: ${item.quantity}`}
                        >
                            {item.quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label={`Збільшити кількість ${item.title}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Subtotal: price × quantity */}
                    <span className="font-mono text-sm font-semibold text-emerald-400">
                        {formatPrice(subtotal)}
                    </span>
                </div>
            </div>
        </li>
    );
};
