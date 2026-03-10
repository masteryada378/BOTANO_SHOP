/**
 * HomePage — landing page магазину для відвідувачів.
 *
 * Після переносу CRUD до AdminPage ця сторінка стає вітальним екраном:
 * короткий месседж + CTA-кнопки для переходу до каталогу.
 * У майбутньому тут розміститься Hero section, Featured products, Newsletter
 * (Етап наступного розвитку — Блок G).
 */

import { Link } from "react-router-dom";
import { ShoppingBag, Zap } from "lucide-react";

const HomePage = () => (
    <section
        aria-labelledby="home-heading"
        className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
        {/* Іконка-акцент */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 ring-1 ring-violet-500/30">
            <Zap size={32} className="text-violet-400" aria-hidden="true" />
        </div>

        <h1
            id="home-heading"
            className="text-3xl font-bold text-white sm:text-4xl"
        >
            Ласкаво просимо до{" "}
            <span className="text-violet-400">BOTANO SHOP</span>
        </h1>

        <p className="mt-4 max-w-md text-base text-gray-400">
            Комікси, фігурки, девайси — все для справжніх гіків. Знаходь улюблені
            товари у нашому каталозі.
        </p>

        {/* CTA-кнопки */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
                to="/catalog"
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
                <ShoppingBag size={18} aria-hidden="true" />
                Перейти до каталогу
            </Link>
        </div>
    </section>
);

export default HomePage;
