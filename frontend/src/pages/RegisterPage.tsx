/**
 * RegisterPage — сторінка реєстрації нового акаунту.
 *
 * Особливості:
 * — Підтвердження пароля: клієнтська валідація що confirmPassword === password.
 * — 409 Conflict: бекенд повертає цей статус якщо email вже зайнятий — показуємо відповідне повідомлення.
 * — Після успішної реєстрації — автоматичний вхід (register() у AuthContext зберігає токен).
 * — Guard: авторизований юзер перенаправляється на /profile.
 */

import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Zap, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
): FormErrors => {
    const errors: FormErrors = {};
    if (!name) errors.name = "Введіть ім'я";
    else if (name.trim().length < 2) errors.name = "Мінімум 2 символи";
    if (!email) errors.email = "Введіть email";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Некоректний формат email";
    if (!password) errors.password = "Введіть пароль";
    else if (password.length < 6) errors.password = "Мінімум 6 символів";
    if (!confirmPassword) errors.confirmPassword = "Підтвердіть пароль";
    else if (confirmPassword !== password)
        errors.confirmPassword = "Паролі не збігаються";
    return errors;
};

export const RegisterPage = () => {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Guard: авторизований юзер не бачить форму реєстрації
    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    const clearFieldError = (field: keyof FormErrors) =>
        setErrors((prev) => ({ ...prev, [field]: undefined }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setApiError(null);

        const validationErrors = validate(name, email, password, confirmPassword);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        setIsSubmitting(true);
        try {
            await register(name.trim(), email, password);
            // Автоматичний вхід — register() вже зберіг токен у AuthContext
            navigate("/", { replace: true });
        } catch (err) {
            // 409 Conflict — email вже зареєстрований
            const message = err instanceof Error ? err.message : "";
            if (message.includes("409")) {
                setApiError("Цей email вже зайнятий. Спробуйте інший або увійдіть.");
            } else {
                setApiError("Помилка реєстрації. Спробуйте ще раз.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                {/* Заголовок */}
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600">
                        <Zap size={24} className="text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Реєстрація
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Приєднуйся до спільноти гіків!
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Ім'я */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1.5 block text-sm font-medium text-gray-300"
                        >
                            Ім'я
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                clearFieldError("name");
                            }}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            placeholder="Твоє ім'я"
                            className={`w-full rounded-xl bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-1 transition focus:ring-2 ${
                                errors.name
                                    ? "ring-red-500 focus:ring-red-500"
                                    : "ring-gray-700 focus:ring-violet-500"
                            }`}
                        />
                        {errors.name && (
                            <p id="name-error" role="alert" className="mt-1 text-xs text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearFieldError("email");
                            }}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            placeholder="you@example.com"
                            className={`w-full rounded-xl bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-1 transition focus:ring-2 ${
                                errors.email
                                    ? "ring-red-500 focus:ring-red-500"
                                    : "ring-gray-700 focus:ring-violet-500"
                            }`}
                        />
                        {errors.email && (
                            <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Пароль */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm font-medium text-gray-300"
                        >
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearFieldError("password");
                                }}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                placeholder="Мінімум 6 символів"
                                className={`w-full rounded-xl bg-gray-800 px-4 py-3 pr-11 text-sm text-white placeholder-gray-500 outline-none ring-1 transition focus:ring-2 ${
                                    errors.password
                                        ? "ring-red-500 focus:ring-red-500"
                                        : "ring-gray-700 focus:ring-violet-500"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff size={16} aria-hidden="true" />
                                ) : (
                                    <Eye size={16} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" role="alert" className="mt-1 text-xs text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Підтвердження пароля */}
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="mb-1.5 block text-sm font-medium text-gray-300"
                        >
                            Підтвердження пароля
                        </label>
                        <input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                clearFieldError("confirmPassword");
                            }}
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={
                                errors.confirmPassword ? "confirm-password-error" : undefined
                            }
                            placeholder="Повторіть пароль"
                            className={`w-full rounded-xl bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-1 transition focus:ring-2 ${
                                errors.confirmPassword
                                    ? "ring-red-500 focus:ring-red-500"
                                    : "ring-gray-700 focus:ring-violet-500"
                            }`}
                        />
                        {errors.confirmPassword && (
                            <p
                                id="confirm-password-error"
                                role="alert"
                                className="mt-1 text-xs text-red-400"
                            >
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* API-помилка */}
                    {apiError && (
                        <div
                            role="alert"
                            className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/30"
                        >
                            {apiError}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <span
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                    aria-hidden="true"
                                />
                                Реєстрація...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} aria-hidden="true" />
                                Зареєструватися
                            </>
                        )}
                    </button>
                </form>

                {/* Посилання на логін */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Вже є акаунт?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                    >
                        Увійти
                    </Link>
                </p>
            </div>
        </main>
    );
};
