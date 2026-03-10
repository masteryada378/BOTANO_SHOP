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

/**
 * Тимчасова заглушка для /profile.
 * Task #22 замінить її на повноцінну ProfilePage з OrderHistory.
 * Використовуємо inline-компонент щоб не створювати окремий файл для заглушки.
 */
const ProfilePlaceholder = () => (
    <main className="container mx-auto max-w-7xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Мій профіль</h1>
        <p className="text-gray-400">Сторінка профілю буде реалізована у Task #22.</p>
    </main>
);

const router = createBrowserRouter([
    {
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
            /**
             * Маршрут сторінки товару.
             * :id — динамічний сегмент, useParams<{ id: string }>() зчитує його у ProductDetail.
             */
            {
                path: "product/:id",
                element: <ProductDetail />,
            },
            /** Сторінка кошика — Task #17 */
            {
                path: "cart",
                element: <CartPage />,
            },
            /** Сторінка оформлення замовлення — Task #18 */
            {
                path: "checkout",
                element: <CheckoutPage />,
            },
            /**
             * Auth сторінки — Task #20.
             * Guard у LoginPage/RegisterPage: авторизований юзер → /profile.
             */
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            /**
             * Профіль — захищений маршрут (тільки для авторизованих).
             * ProtectedRoute перенаправляє неавторизованих на /login з location.state.from.
             * Task #22 замінить ProfilePlaceholder на повноцінну сторінку.
             */
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePlaceholder />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export const AppRoutes: React.FC = () => {
    return <RouterProvider router={router} />;
};
