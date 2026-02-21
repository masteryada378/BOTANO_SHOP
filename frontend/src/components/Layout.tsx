import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "./Footer";

export const Layout: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
                Перейти до контенту
            </a>

            <Header />

            <main
                id="main-content"
                role="main"
                className="flex-1 container mx-auto w-full max-w-7xl px-4 py-8"
            >
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
