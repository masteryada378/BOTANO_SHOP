/**
 * EditProductModal — модальне вікно редагування товару.
 *
 * Перероблено: темна тема (відповідає дизайн-системі), всі поля Card,
 * category як <select> з CATEGORIES, in_stock як toggle-checkbox.
 *
 * handleChange підтримує input/select/textarea через HTMLElement union.
 * Числові поля (price, old_price) конвертуються в number при зміні.
 * in_stock обробляється окремо як boolean через checked.
 */

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "../types/Card";
import { CATEGORIES } from "../types/catalog";
import { updateCard } from "../services/cardService";

interface EditProductModalProps {
    card: Card;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const EditProductModal = ({
    card,
    isOpen,
    onClose,
    onUpdate,
}: EditProductModalProps) => {
    const [formData, setFormData] = useState<Card>(card);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Синхронізуємо форму при відкритті іншого товару (card prop змінюється)
    useEffect(() => {
        setFormData(card);
        setError(null);
    }, [card]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            // Окремо обробляємо checkbox для in_stock
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        // Числові поля конвертуємо в number; порожній рядок → null
        const isNumeric = name === "price" || name === "old_price";
        setFormData((prev) => ({
            ...prev,
            [name]: isNumeric
                ? value === "" ? null : Number(value)
                : value === "" ? null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || (formData.price ?? 0) <= 0) {
            setError("Назва та ціна обов'язкові.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await updateCard(formData);
            onUpdate();
            onClose();
        } catch {
            setError("Помилка при збереженні. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 ring-1 ring-gray-700 outline-none focus:ring-violet-500 transition";

    return (
        /* Overlay — клік поза модалкою закриває її */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
                    <h2 className="text-lg font-semibold text-white">
                        Редагувати товар
                        <span className="ml-2 text-xs font-normal text-gray-500">
                            ID #{card.id}
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Закрити"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form — прокручується якщо не вміщається у viewport */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto flex-1 px-6 py-5 space-y-4"
                >
                    {/* Назва */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">
                            Назва товару *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Назва товару"
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Бренд */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">
                            Бренд
                        </label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand ?? ""}
                            onChange={handleChange}
                            placeholder="Marvel, Funko Pop, Nintendo..."
                            className={inputClass}
                        />
                    </div>

                    {/* Категорія */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">
                            Категорія
                        </label>
                        <select
                            name="category"
                            value={formData.category ?? ""}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">— Без категорії —</option>
                            {CATEGORIES.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ціна + Стара ціна в ряд */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-400">
                                Ціна, ₴ *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-400">
                                Стара ціна, ₴
                                <span className="ml-1 text-gray-600">(знижка)</span>
                            </label>
                            <input
                                type="number"
                                name="old_price"
                                value={formData.old_price ?? ""}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* URL зображення */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">
                            URL зображення
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image ?? ""}
                            onChange={handleChange}
                            placeholder="https://..."
                            className={inputClass}
                        />
                    </div>

                    {/* Опис */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">
                            Опис
                        </label>
                        <textarea
                            name="description"
                            value={formData.description ?? ""}
                            onChange={handleChange}
                            placeholder="Детальний опис товару..."
                            rows={3}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* В наявності */}
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            name="in_stock"
                            checked={formData.in_stock ?? true}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-900 accent-violet-500"
                        />
                        <span className="text-sm text-gray-300">
                            В наявності
                        </span>
                        <span className="text-xs text-gray-500">
                            (знімаємо прапорець якщо товар під замовлення)
                        </span>
                    </label>

                    {/* Помилка */}
                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}
                </form>

                {/* Footer з кнопками */}
                <div className="flex justify-end gap-2 border-t border-gray-700 px-6 py-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Скасувати
                    </button>
                    <button
                        type="submit"
                        form=""
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? "Збереження..." : "Зберегти зміни"}
                    </button>
                </div>
            </div>
        </div>
    );
};
