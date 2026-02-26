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
    showBadge?: boolean;
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
    },
    {
        to: "/catalog",
        label: "Catalog",
        ariaLabel: "Go to catalog page",
        icon: <List />,
    },
    {
        to: "/cart",
        label: "Cart",
        ariaLabel: "Go to cart page",
        icon: <ShoppingCart />,
    },
    {
        to: "/wishlist",
        label: "Wishlist",
        ariaLabel: "Go to wishlist page",
        icon: <Heart />,
    },
    {
        to: "/profile",
        label: "Profile",
        ariaLabel: "Go to profile page",
        icon: <CircleUserRound />,
    },
];

export const BottomNavigation = ({ cartItemsCount }: BottomNavigationProps) => {
    return (
        <nav
            aria-label="Bottom navigation"
            className={cn(
                "w-full border-t pt-2 md:hidden",
                "pb-[calc(env(safe-area-inset-bottom)+8px)]"
            )}
        >
            <ul className="grid grid-cols-5">
                {bottomNavItems.map((item) => {
                    const isCart = item.to === "/cart";

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
                                            ? "text-blue-600"
                                            : "text-gray-500 hover:text-gray-800"
                                    )
                                }
                            >
                                <div className="relative text-lg">
                                    {item.icon}

                                    {/* Badge skeleton (тільки для Cart) */}
                                    {isCart &&
                                        cartItemsCount !== undefined &&
                                        cartItemsCount > 0 && (
                                            <span
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
