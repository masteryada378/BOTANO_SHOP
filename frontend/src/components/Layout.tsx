import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "./Footer";
import { BottomNavigation } from "../layouts/BottomNavigation";
import { useAppContext } from "../context/AppContext";

export const Layout: React.FC = () => {
    const { cart } = useAppContext();

    return (
        <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
            <Header />
            <main
                id="main-content"
                role="main"
                /*
                 * pb-[calc(...)]: компенсує висоту fixed BottomNavigation на mobile,
                 * щоб контент (особливо CTA-кнопки внизу сторінки) не ховався під нею.
                 * md:pb-8: на tablet/desktop BottomNavigation прихована, повертаємо звичайний відступ.
                 * ~64px = висота nav (44px min-h + pt-2 + pb safe-area ~8px) + запас.
                 */
                className="flex-1 container mx-auto w-full max-w-7xl px-4 py-8 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-8"
            >
                <Outlet />
            </main>
            <Footer />
            <BottomNavigation cartItemsCount={cart.length} />
        </div>
    );
};
