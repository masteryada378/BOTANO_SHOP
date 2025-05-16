import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../components/Layout";
import HomePage from "../pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
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
