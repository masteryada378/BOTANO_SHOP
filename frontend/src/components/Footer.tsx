import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Instagram } from "lucide-react";

const CATALOG_LINKS = [
    { to: "/comics", label: "Комікси" },
    { to: "/figures", label: "Фігурки" },
    { to: "/devices", label: "Девайси" },
    { to: "/catalog", label: "Весь каталог" },
] as const;

const INFO_LINKS = [
    { to: "/about", label: "Про нас" },
    { to: "/delivery", label: "Доставка та оплата" },
    { to: "/returns", label: "Повернення" },
    { to: "/contacts", label: "Контакти" },
] as const;

const SOCIAL_LINKS = [
    { href: "https://github.com", label: "GitHub", Icon: Github },
    { href: "https://twitter.com", label: "Twitter / X", Icon: Twitter },
    { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
] as const;

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BOTANO SHOP",
    description:
        "Інтернет-магазин для гіків: комікси, фігурки, девайси та колекційні видання.",
    url: "https://botano.shop",
    logo: "https://botano.shop/logo.png",
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+380-00-000-00-00",
        contactType: "customer service",
        availableLanguage: "Ukrainian",
    },
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            role="contentinfo"
            aria-label="Підвал сайту"
            className="mt-auto border-t border-gray-800 bg-gray-900"
        >
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            <div className="container mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/"
                            aria-label="BOTANO SHOP — головна"
                            className="flex items-center gap-2 w-fit group"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-white group-hover:bg-violet-500 transition-colors">
                                <Zap size={18} aria-hidden="true" />
                            </span>
                            <span className="font-bold text-lg text-white tracking-tight">
                                BOTANO<span className="text-violet-400">.</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Магазин для справжніх гіків. Комікси Marvel та DC, аніме-фігурки,
                            ретро-девайси та рідкісні колекційні видання — все в одному місці.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3">
                            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-gray-400 hover:bg-violet-600 hover:text-white transition-colors"
                                >
                                    <Icon size={16} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Catalog links */}
                    <div>
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">
                            Каталог
                        </h2>
                        <ul className="flex flex-col gap-2.5" role="list">
                            {CATALOG_LINKS.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info links */}
                    <div>
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-200">
                            Інформація
                        </h2>
                        <ul className="flex flex-col gap-2.5" role="list">
                            {INFO_LINKS.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/* Placeholder contact */}
                        <address className="mt-6 not-italic text-sm text-gray-500 leading-relaxed">
                            <a
                                href="tel:+380000000000"
                                className="hover:text-violet-400 transition-colors"
                            >
                                +38 (000) 000-00-00
                            </a>
                            <br />
                            <a
                                href="mailto:hello@botano.shop"
                                className="hover:text-violet-400 transition-colors"
                            >
                                hello@botano.shop
                            </a>
                        </address>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                    <small className="text-xs text-gray-500">
                        © {currentYear} BOTANO SHOP. Всі права захищені.
                    </small>
                    <nav aria-label="Юридичні посилання" className="flex gap-4">
                        <Link
                            to="/privacy"
                            className="text-xs text-gray-500 hover:text-violet-400 transition-colors"
                        >
                            Конфіденційність
                        </Link>
                        <Link
                            to="/terms"
                            className="text-xs text-gray-500 hover:text-violet-400 transition-colors"
                        >
                            Умови використання
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
