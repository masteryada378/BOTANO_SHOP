import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useDebounce } from "../hooks/useDebounce";

const NAV_LINKS = [
    { to: "/", label: "Головна" },
    { to: "/catalog", label: "Каталог" },
    { to: "/comics", label: "Комікси" },
    { to: "/figures", label: "Фігурки" },
    { to: "/devices", label: "Девайси" },
    { to: "/contacts", label: "Контакти" },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 hover:text-violet-400 ${
        isActive ? "text-violet-400" : "text-gray-300"
    }`;

const getCartLabelSuffix = (n: number): string => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
        return "товари";
    return "товарів";
};

export const Header = () => {
    const { cart } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        if (!isSearchOpen) setSearchQuery("");
    }, [isSearchOpen]);

    useEffect(() => {
        console.log("Search:", debouncedQuery);
    }, [debouncedQuery]);

    const cartCount = cart.length;
    const cartLabel =
        cartCount === 0
            ? "Кошик"
            : `У кошику ${cartCount} ${getCartLabelSuffix(cartCount)}`;

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link
                    to="/"
                    aria-label="BOTANO SHOP — повернутись на головну"
                    className="flex items-center gap-2 group"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-white group-hover:bg-violet-500 transition-colors">
                        <Zap size={18} aria-hidden="true" />
                    </span>
                    <span className="font-bold text-lg tracking-tight text-white">
                        BOTANO<span className="text-violet-400">.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav
                    aria-label="Головне меню"
                    className="hidden md:flex items-center gap-6"
                >
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={navLinkClass}
                            end={to === "/"}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                        aria-label="Пошук товарів"
                        aria-expanded={isSearchOpen}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <Search size={20} aria-hidden="true" />
                    </button>

                    <Link
                        to="/cart"
                        aria-label={cartLabel}
                        className="relative rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <ShoppingCart size={20} aria-hidden="true" />
                        {cartCount > 0 && (
                            <span
                                aria-hidden="true"
                                className="absolute -top-0.5 -right-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white leading-none"
                            >
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/profile"
                        aria-label="Профіль користувача"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <User size={20} aria-hidden="true" />
                    </Link>

                    <button
                        onClick={toggleMenu}
                        aria-label={
                            isMenuOpen ? "Закрити меню" : "Відкрити меню"
                        }
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        className="ml-1 rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors md:hidden"
                    >
                        {isMenuOpen ? (
                            <X size={22} aria-hidden="true" />
                        ) : (
                            <Menu size={22} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {isSearchOpen && (
                <div className="border-t border-gray-800 bg-gray-900 px-4 py-3">
                    <label htmlFor="site-search" className="sr-only">
                        Пошук по сайту
                    </label>
                    <div className="container mx-auto max-w-7xl flex items-center gap-2 rounded-md bg-gray-800 px-3 ring-1 ring-gray-700 focus-within:ring-violet-500 transition">
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="shrink-0 text-gray-500"
                        />
                        <input
                            id="site-search"
                            type="search"
                            placeholder="Шукати комікси, фігурки, девайси..."
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent py-2 pr-4 text-sm text-gray-100 placeholder-gray-500 outline-none"
                        />
                    </div>
                </div>
            )}

            {isMenuOpen && (
                <nav
                    id="mobile-menu"
                    aria-label="Мобільне меню"
                    className="border-t border-gray-800 bg-gray-900 md:hidden"
                >
                    <ul
                        className="container mx-auto flex flex-col px-4 py-4 gap-1"
                        role="list"
                    >
                        {NAV_LINKS.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={to === "/"}
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-violet-600/20 text-violet-400"
                                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
};

