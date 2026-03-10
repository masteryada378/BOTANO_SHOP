/**
 * ProtectedRoute — компонент-обгортка для маршрутів, доступних тільки авторизованим юзерам.
 *
 * Чому компонент, а не HOC?
 * — Composition pattern краще вписується в React Router v6+.
 *   Використовується як: <Route element={<ProtectedRoute><Page /></ProtectedRoute>} />
 *
 * Три стани:
 * 1. isLoading = true → spinner (AuthProvider ще перевіряє токен через GET /auth/me).
 *    Без цього авторизований юзер побачить flash redirect на /login при F5.
 * 2. !isAuthenticated → redirect на /login з location.state.from для повернення після логіну.
 * 3. isAuthenticated → рендеримо children.
 */

import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Показуємо нейтральний спінер поки AuthProvider перевіряє токен.
        // Це запобігає "flash of login page" для авторизованих юзерів.
        return (
            <div
                className="flex min-h-[calc(100vh-4rem)] items-center justify-center"
                aria-label="Перевірка авторизації"
                role="status"
            >
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-violet-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        /**
         * Передаємо location.state.from — після успішного логіну LoginPage
         * перенаправить юзера назад на цю сторінку (а не на /).
         * replace=true: не додаємо /login до history стеку (назад → оригінальна сторінка, не логін).
         */
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
