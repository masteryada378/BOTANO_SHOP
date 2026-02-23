import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Zap } from "lucide-react";

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

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                    {/* Search toggle */}
                    <button
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                        aria-label="Пошук товарів"
                        aria-expanded={isSearchOpen}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <Search size={20} aria-hidden="true" />
                    </button>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        aria-label="Кошик"
                        className="relative rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <ShoppingCart size={20} aria-hidden="true" />
                        {/* Placeholder badge */}
                        <span
                            aria-label="3 товари у кошику"
                            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white leading-none"
                        >
                            3
                        </span>
                    </Link>

                    {/* Profile */}
                    <Link
                        to="/profile"
                        aria-label="Профіль користувача"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <User size={20} aria-hidden="true" />
                    </Link>

                    {/* Hamburger — mobile only */}
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

            {/* Search bar (expandable) */}
            {isSearchOpen && (
                <div className="border-t border-gray-800 bg-gray-900 px-4 py-3">
                    <label htmlFor="site-search" className="sr-only">
                        Пошук по сайту
                    </label>
                    <div className="relative container mx-auto max-w-7xl">
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            id="site-search"
                            type="search"
                            placeholder="Шукати комікси, фігурки, девайси..."
                            autoFocus
                            className="w-full rounded-md bg-gray-800 py-2 pl-9 pr-4 text-sm text-gray-100 placeholder-gray-500 outline-none ring-1 ring-gray-700 focus:ring-violet-500 transition"
                        />
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav
                    id="mobile-menu"
                    role="dialog"
                    aria-label="Мобільне меню"
                    aria-modal="true"
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

export default Header;
