import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../components/Footer";

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
