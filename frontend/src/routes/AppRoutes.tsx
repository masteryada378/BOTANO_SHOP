/**
 * AppRoutes — централізоване визначення клієнтського роутингу.
 *
 * Використовує createBrowserRouter (React Router v6+) замість <BrowserRouter>:
 * — Data API (loader/action) доступне для майбутніх оптимізацій.
 * — Кращий TypeScript-support та error boundaries на рівні роуту.
 *
 * Захищені маршрути обгорнуті в ProtectedRoute:
 * — Перевіряє isAuthenticated з AuthContext.
 * — Redirect на /login з location.state.from — щоб повернутись після логіну.
 * — Під час перевірки (isLoading) — spinner, не redirect.
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../components/Layout";
import HomePage from "../pages/Home";
import { CatalogPage } from "../pages/Catalog";
import { ProductDetail } from "../pages/ProductDetail";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { ProfilePage } from "../pages/ProfilePage";
import { AdminRoute } from "../components/AdminRoute";
import { AdminPage } from "../pages/AdminPage";

const router = createBrowserRouter([
    {
        /**
         * Кореневий маршрут "/" — обгортка Layout для всіх дочірніх сторінок.
         * Layout рендерить Header, <Outlet /> (сторінка), Footer, BottomNavigation.
         */
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "catalog",
                element: <CatalogPage />,
            },
            {
                /**
                 * Маршрут сторінки товару.
                 * :id — динамічний сегмент, useParams<{ id: string }>() зчитує його у ProductDetail.
                 */
                path: "product/:id",
                element: <ProductDetail />,
            },
            {
                /** Сторінка кошика — Task #17 */
                path: "cart",
                element: <CartPage />,
            },
            {
                /** Сторінка оформлення замовлення — Task #18 */
                path: "checkout",
                element: <CheckoutPage />,
            },
            {
                /**
                 * Auth сторінки — Task #20.
                 * Guard у LoginPage/RegisterPage: авторизований юзер → /profile.
                 * Запобігає ситуації "увійшов, але бачить форму логіну".
                 */
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                /**
                 * Профіль — Task #22.
                 * ProtectedRoute: неавторизований → redirect /login з state.from.
                 * Після логіну → redirect назад на /profile (якщо is state.from).
                 *
                 * Чому ProtectedRoute як wrapper, а не окремий route type?
                 * — Composition pattern: компонент явно декларує захист у JSX,
                 *   не потрібна спеціальна конфігурація router.
                 */
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                /**
                 * Адмін-панель — Task #23.
                 * AdminRoute: гість → /login, авторизований не-адмін → /,
                 * адмін → AdminPage.
                 *
                 * Подвійний захист: AdminRoute (фронтенд UX-guard) +
                 * adminMiddleware (бекенд security-guard).
                 */
                path: "admin",
                element: (
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                ),
            },
        ],
    },
]);

export const AppRoutes: React.FC = () => {
    return <RouterProvider router={router} />;
};
