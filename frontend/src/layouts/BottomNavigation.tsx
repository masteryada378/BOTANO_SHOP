import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import {
    House,
    List,
    ShoppingCart,
    Heart,
    CircleUserRound,
} from "lucide-react";

interface BottomNavItem {
    to: string;
    label: string;
    ariaLabel: string;
    icon: ReactNode;
    /** Якщо false — роут ще не реалізований, пункт відображається як disabled */
    enabled: boolean;
}

interface BottomNavigationProps {
    cartItemsCount?: number;
}

const bottomNavItems: BottomNavItem[] = [
    {
        to: "/",
        label: "Home",
        ariaLabel: "Go to home page",
        icon: <House />,
        enabled: true,
    },
    {
        to: "/catalog",
        label: "Catalog",
        ariaLabel: "Go to catalog page",
        icon: <List />,
        enabled: true,
    },
    {
        to: "/cart",
        label: "Cart",
        ariaLabel: "Go to cart page",
        icon: <ShoppingCart />,
        // Увімкнено після Task #17 — сторінка кошика реалізована
        enabled: true,
    },
    {
        to: "/wishlist",
        label: "Wishlist",
        ariaLabel: "Go to wishlist page",
        icon: <Heart />,
        enabled: false,
    },
    {
        to: "/profile",
        label: "Profile",
        ariaLabel: "Go to profile page",
        icon: <CircleUserRound />,
        enabled: false,
    },
];

export const BottomNavigation = ({ cartItemsCount }: BottomNavigationProps) => {
    return (
        /*
         * fixed + bottom-0: єдиний надійний спосіб "завжди внизу viewport при скролі"
         * у flex-col layout. sticky прилипає до кінця flex-контейнера (не viewport).
         * md:hidden: mobile-only, на tablet/desktop навігація не відображається.
         * safe-area-inset-bottom: компенсація для iPhone з home indicator.
         */
        <nav
            aria-label="Bottom navigation"
            className={cn(
                "fixed bottom-0 left-0 right-0 z-10 md:hidden",
                "bg-gray-950 border-t border-gray-800",
                "pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)]"
            )}
        >
            <ul className="grid grid-cols-5">
                {bottomNavItems.map((item) => {
                    const isCart = item.to === "/cart";

                    if (!item.enabled) {
                        /*
                         * Disabled стан: пункт без реалізованого роуту.
                         * Використовуємо <span> замість NavLink, щоб не провокувати
                         * 404 і не плутати скрін-рідери фіктивними посиланнями.
                         * aria-disabled + cursor-not-allowed — стандартний a11y-патерн.
                         */
                        return (
                            <li key={item.to}>
                                <span
                                    aria-label={`${item.ariaLabel} (coming soon)`}
                                    aria-disabled="true"
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1",
                                        "min-h-[44px] text-xs",
                                        "text-gray-700 cursor-not-allowed select-none"
                                    )}
                                >
                                    <div className="relative text-lg">
                                        {item.icon}
                                    </div>
                                    <span>{item.label}</span>
                                </span>
                            </li>
                        );
                    }

                    return (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                aria-label={item.ariaLabel}
                                className={({ isActive }) =>
                                    cn(
                                        "flex flex-col items-center justify-center gap-1",
                                        "min-h-[44px] text-xs transition-colors",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                        isActive
                                            ? "text-blue-500"
                                            : "text-gray-500 hover:text-gray-300"
                                    )
                                }
                            >
                                <div className="relative text-lg">
                                    {item.icon}

                                    {/* Badge тільки для Cart, коли є товари */}
                                    {isCart &&
                                        cartItemsCount !== undefined &&
                                        cartItemsCount > 0 && (
                                            <span
                                                aria-label={`${cartItemsCount} items in cart`}
                                                className={cn(
                                                    "absolute -top-2 -right-2",
                                                    "min-w-[18px] h-[18px] px-1",
                                                    "rounded-full bg-red-500 text-white text-[10px]",
                                                    "flex items-center justify-center"
                                                )}
                                            >
                                                {cartItemsCount}
                                            </span>
                                        )}
                                </div>

                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
