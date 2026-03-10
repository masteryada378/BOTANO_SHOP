/**
 * AdminRoute — guard компонент для маршрутів, доступних тільки адмінам.
 *
 * Відрізняється від ProtectedRoute тим, що перевіряє не лише факт авторизації,
 * але й роль юзера. Звичайний авторизований юзер отримає redirect на /,
 * а не на /login.
 *
 * Три стани:
 * 1. isLoading → spinner (запобігаємо flash redirect при F5).
 * 2. !isAuthenticated → redirect на /login (з state.from для повернення).
 * 3. user.role !== 'admin' → redirect на / з повідомленням (UX-захист).
 * 4. role === 'admin' → рендеримо children.
 *
 * Важливо: цей компонент — UX-захист, не security.
 * Реальний захист — adminMiddleware на бекенді, який перевіряє роль
 * незалежно від того, як клієнт потрапив до ендпоінту.
 */

import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Нейтральний спінер під час перевірки токену при першому рендері
        return (
            <div
                className="flex min-h-[calc(100vh-4rem)] items-center justify-center"
                aria-label="Перевірка прав доступу"
                role="status"
            >
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-violet-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Гість → /login, зберігаємо state.from для повернення після логіну
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== "admin") {
        // Авторизований, але не адмін → перенаправляємо на головну
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
