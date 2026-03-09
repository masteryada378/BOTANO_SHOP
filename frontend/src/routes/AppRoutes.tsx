import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../components/Layout";
import HomePage from "../pages/Home";
import { CatalogPage } from "../pages/Catalog";
import { ProductDetail } from "../pages/ProductDetail";

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
             * Шлях /product/:id є стандартом e-commerce (SEO-friendly, share-able URL).
             */
            {
                path: "product/:id",
                element: <ProductDetail />,
            },
            // {
            //     path: "/login",
            //     element: <LoginPage />,
            // },
            // {
            //     path: "*",
            //     element: <ErrorPage title="404 Not Found" message="WTF HZ" />,
            // },
        ],
    },
]);

// TODO
//  <Toaster />

export const AppRoutes: React.FC = () => {
    return <RouterProvider router={router} />;
};
