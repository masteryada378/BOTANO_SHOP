/**
 * LoginPage — сторінка входу до акаунту.
 *
 * Особливості:
 * — Guard: авторизований юзер одразу перенаправляється на /profile (немає сенсу бачити цю сторінку).
 * — Redirect після логіну: якщо юзер потрапив сюди через ProtectedRoute (location.state.from),
 *   повертається на попередню сторінку. Інакше — на головну.
 * — isLoading показується на кнопці (не блокує форму), щоб UX залишався відчуйним.
 */

import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Zap, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface FormErrors {
    email?: string;
    password?: string;
}

/** Базовий regexp для email (без заумної RFC 5321 реалізації — достатньо для клієнтської валідації) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (email: string, password: string): FormErrors => {
    const errors: FormErrors = {};
    if (!email) errors.email = "Введіть email";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Некоректний формат email";
    if (!password) errors.password = "Введіть пароль";
    else if (password.length < 6) errors.password = "Мінімум 6 символів";
    return errors;
};

export const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Guard: авторизований юзер не повинен бачити сторінку логіну
    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setApiError(null);

        const validationErrors = validate(email, password);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        setIsSubmitting(true);
        try {
            await login(email, password);
            // Повертаємось на попередню сторінку (якщо є) або на головну
            const from =
                (location.state as { from?: { pathname: string } } | null)?.from
                    ?.pathname ?? "/";
            navigate(from, { replace: true });
        } catch {
            // 401 — невірні credentials (бекенд не уточнює що саме — information disclosure prevention)
            setApiError("Невірний email або пароль");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                {/* Логотип / заголовок */}
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600">
                        <Zap size={24} className="text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Вхід до акаунту
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Раді бачити тебе знову, гіку!
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
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

                    {/* Password */}
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
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password)
                                        setErrors((prev) => ({ ...prev, password: undefined }));
                                }}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                placeholder="••••••"
                                className={`w-full rounded-xl bg-gray-800 px-4 py-3 pr-11 text-sm text-white placeholder-gray-500 outline-none ring-1 transition focus:ring-2 ${
                                    errors.password
                                        ? "ring-red-500 focus:ring-red-500"
                                        : "ring-gray-700 focus:ring-violet-500"
                                }`}
                            />
                            {/* Toggle показу пароля — стандартний UX e-commerce форм */}
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

                    {/* API-помилка (невірні credentials) */}
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
                                Вхід...
                            </>
                        ) : (
                            <>
                                <LogIn size={16} aria-hidden="true" />
                                Увійти
                            </>
                        )}
                    </button>
                </form>

                {/* Посилання на реєстрацію */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Немає акаунту?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                    >
                        Зареєструватися
                    </Link>
                </p>
            </div>
        </main>
    );
};
