/**
 * CheckoutPage — сторінка оформлення замовлення (/checkout).
 *
 * Чому single-page checkout (без multi-step wizard)?
 * — Для MVP один скрол краще, ніж три кроки з переходами.
 *   Multi-step можна додати пізніше при потребі A/B тесту.
 *
 * Layout:
 * — Mobile: одна колонка (форма зверху, summary знизу).
 * — Desktop (md+): grid [1fr 380px] — форма ліворуч, summary праворуч (sticky).
 *
 * Guard:
 * — Якщо кошик порожній — показуємо повідомлення з посиланням на /cart.
 *   Redirect був би агресивнішим — юзер міг випадково перейти.
 *
 * Success state:
 * — Після успіху замінюємо форму на confirmation inline (не redirect),
 *   щоб не ускладнювати роутинг до Task #19+ (Auth).
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Loader2, ShoppingCart } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useAppContext } from "../context/AppContext";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { createOrder } from "../services/orderService";
import { formatPrice } from "../lib/formatPrice";
import { pluralizeUk } from "../lib/pluralize";
import { cn } from "../lib/cn";
import { DELIVERY_METHODS, PAYMENT_METHODS } from "../types/checkout";

// ── Допоміжні компоненти ──────────────────────────────────────────────────────

/** Лейбл + інпут + повідомлення про помилку */
const FormField = ({
    label,
    id,
    error,
    children,
}: {
    label: string;
    id: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
            {label}
        </label>
        {children}
        {error && (
            <p className="text-xs text-red-400" role="alert">
                {error}
            </p>
        )}
    </div>
);

/** Базові класи для текстових input/select */
const inputClass = (hasError: boolean) =>
    cn(
        "w-full rounded-lg border bg-gray-800 px-3 py-2.5 text-sm text-white",
        "placeholder-gray-500 outline-none transition-colors",
        "focus:border-violet-500",
        hasError ? "border-red-500" : "border-gray-700",
    );

// ── Main component ────────────────────────────────────────────────────────────

export const CheckoutPage = () => {
    const { cart, totalItems, totalPrice, clearCart } = useAppContext();
    const { formData, errors, handleChange, validate } = useCheckoutForm();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

    // ── Guard: порожній кошик ────────────────────────────────────────────────
    if (cart.length === 0 && successOrderId === null) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <ShoppingCart
                        className="h-20 w-20 text-gray-700"
                        aria-hidden="true"
                    />
                    <h1 className="text-xl font-semibold text-gray-300">
                        Кошик порожній — оформлення неможливе
                    </h1>
                    <Link
                        to="/cart"
                        className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                    >
                        Повернутися до кошика
                    </Link>
                </div>
            </main>
        );
    }

    // ── Success state ────────────────────────────────────────────────────────
    if (successOrderId !== null) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="flex flex-col items-center gap-6 py-16 text-center">
                    <CheckCircle
                        className="h-20 w-20 text-emerald-400"
                        aria-hidden="true"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Замовлення #{successOrderId} створено!
                        </h1>
                        <p className="mt-2 text-gray-400">
                            Ми зв'яжемося з вами найближчим часом для підтвердження.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/"
                            className="rounded-xl border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-violet-500 hover:text-white"
                        >
                            На головну
                        </Link>
                        <Link
                            to="/catalog"
                            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                        >
                            До каталогу
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // ── Submit handler ───────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const result = await createOrder(formData, cart);
            // Очищаємо кошик ПІСЛЯ успішного запиту — не раніше
            clearCart();
            setSuccessOrderId(result.id);
        } catch {
            setSubmitError("Не вдалося оформити замовлення. Спробуйте ще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPickup = formData.deliveryMethod === "pickup";

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Головна", to: "/" },
                        { label: "Кошик", to: "/cart" },
                        { label: "Оформлення" },
                    ]}
                />
            </div>

            <h1 className="mb-8 text-2xl font-bold text-white">
                Оформлення замовлення
            </h1>

            {/*
             * Desktop: grid [1fr 380px].
             * Mobile: block — форма зверху, summary знизу (природний порядок).
             */}
            <div className="grid gap-8 md:grid-cols-[1fr_380px]">

                {/* ── Форма ───────────────────────────────────────────────── */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label="Форма оформлення замовлення"
                >
                    {/* Секція: контактні дані */}
                    <fieldset className="mb-6 rounded-xl border border-gray-800 p-5">
                        <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Контактні дані
                        </legend>
                        <div className="mt-4 flex flex-col gap-4">
                            <FormField
                                label="Ім'я та прізвище *"
                                id="customerName"
                                error={errors.customerName}
                            >
                                <input
                                    id="customerName"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Іван Петренко"
                                    value={formData.customerName}
                                    onChange={(e) =>
                                        handleChange("customerName", e.target.value)
                                    }
                                    className={inputClass(!!errors.customerName)}
                                />
                            </FormField>

                            <FormField
                                label="Телефон *"
                                id="customerPhone"
                                error={errors.customerPhone}
                            >
                                <input
                                    id="customerPhone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="+380XXXXXXXXX"
                                    value={formData.customerPhone}
                                    onChange={(e) =>
                                        handleChange("customerPhone", e.target.value)
                                    }
                                    className={inputClass(!!errors.customerPhone)}
                                />
                            </FormField>

                            <FormField
                                label="Email *"
                                id="customerEmail"
                                error={errors.customerEmail}
                            >
                                <input
                                    id="customerEmail"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="your@email.com"
                                    value={formData.customerEmail}
                                    onChange={(e) =>
                                        handleChange("customerEmail", e.target.value)
                                    }
                                    className={inputClass(!!errors.customerEmail)}
                                />
                            </FormField>
                        </div>
                    </fieldset>

                    {/* Секція: доставка */}
                    <fieldset className="mb-6 rounded-xl border border-gray-800 p-5">
                        <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Доставка
                        </legend>
                        <div className="mt-4 flex flex-col gap-4">
                            <FormField
                                label="Спосіб доставки *"
                                id="deliveryMethod"
                                error={errors.deliveryMethod}
                            >
                                <select
                                    id="deliveryMethod"
                                    value={formData.deliveryMethod}
                                    onChange={(e) =>
                                        handleChange("deliveryMethod", e.target.value)
                                    }
                                    className={inputClass(!!errors.deliveryMethod)}
                                >
                                    <option value="" disabled>
                                        Оберіть спосіб доставки
                                    </option>
                                    {DELIVERY_METHODS.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {/*
                             * Адреса ховається при самовивозі.
                             * CSS transition + max-h для плавного collapse.
                             */}
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-200",
                                    isPickup ? "max-h-0 opacity-0" : "max-h-40 opacity-100",
                                )}
                                aria-hidden={isPickup}
                            >
                                <FormField
                                    label="Адреса доставки *"
                                    id="deliveryAddress"
                                    error={errors.deliveryAddress}
                                >
                                    <input
                                        id="deliveryAddress"
                                        type="text"
                                        placeholder="м. Київ, відділення №1 або вулиця, будинок"
                                        value={formData.deliveryAddress}
                                        onChange={(e) =>
                                            handleChange(
                                                "deliveryAddress",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass(!!errors.deliveryAddress)}
                                        tabIndex={isPickup ? -1 : 0}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </fieldset>

                    {/* Секція: оплата */}
                    <fieldset className="mb-6 rounded-xl border border-gray-800 p-5">
                        <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Оплата
                        </legend>
                        <div className="mt-4 flex flex-col gap-3" role="radiogroup">
                            {PAYMENT_METHODS.map((m) => (
                                <label
                                    key={m.value}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                                        formData.paymentMethod === m.value
                                            ? "border-violet-500 bg-violet-500/10"
                                            : "border-gray-700 hover:border-gray-600",
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={m.value}
                                        checked={formData.paymentMethod === m.value}
                                        onChange={(e) =>
                                            handleChange("paymentMethod", e.target.value)
                                        }
                                        className="accent-violet-500"
                                    />
                                    <span className="text-sm text-gray-200">
                                        {m.label}
                                    </span>
                                </label>
                            ))}
                            {errors.paymentMethod && (
                                <p className="text-xs text-red-400" role="alert">
                                    {errors.paymentMethod}
                                </p>
                            )}
                        </div>
                    </fieldset>

                    {/* Помилка API */}
                    {submitError && (
                        <div
                            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                            role="alert"
                        >
                            {submitError}
                        </div>
                    )}

                    {/* CTA — submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "flex w-full items-center justify-center gap-2",
                            "rounded-xl py-3 text-base font-semibold text-white transition-colors",
                            isSubmitting
                                ? "cursor-not-allowed bg-violet-600/60"
                                : "bg-violet-600 hover:bg-violet-500",
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2
                                    className="h-5 w-5 animate-spin"
                                    aria-hidden="true"
                                />
                                Оформлення...
                            </>
                        ) : (
                            "Підтвердити замовлення"
                        )}
                    </button>
                </form>

                {/* ── Order Summary ────────────────────────────────────────── */}
                <aside
                    aria-label="Підсумок замовлення"
                    className="md:sticky md:top-24 h-fit rounded-xl border border-gray-800 bg-gray-900 p-6"
                >
                    <h2 className="mb-4 text-base font-semibold text-white">
                        Ваше замовлення
                    </h2>

                    {/* Стислий список товарів */}
                    <ul className="mb-4 flex flex-col gap-2">
                        {cart.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-start justify-between gap-2 text-sm"
                            >
                                <span className="line-clamp-2 flex-1 text-gray-300">
                                    {item.title}{" "}
                                    <span className="text-gray-500">
                                        × {item.quantity}
                                    </span>
                                </span>
                                <span className="shrink-0 font-mono text-gray-300">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-gray-700 pt-4">
                        {/* Кількість */}
                        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                            <span>
                                {pluralizeUk(
                                    totalItems,
                                    "одиниця",
                                    "одиниці",
                                    "одиниць",
                                )}
                            </span>
                            <span>{totalItems}</span>
                        </div>

                        {/* Загальна сума */}
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">Разом:</span>
                            <span className="font-mono text-xl font-bold text-emerald-400">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};
