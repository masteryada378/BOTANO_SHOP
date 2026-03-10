/**
 * ProfilePage — особиста сторінка авторизованого юзера.
 *
 * Структура:
 * — Breadcrumbs: "Головна > Профіль"
 * — User Info Card: ім'я, email, роль, дата реєстрації, кнопка виходу.
 * — Order History: список замовлень з деталями (smart-компонент OrderHistory).
 *
 * Desktop layout: grid [280px sticky sidebar | 1fr content].
 * Mobile: одна колонка (sidebar зверху, orders знизу).
 *
 * Чому цей компонент не завантажує дані сам?
 * — Дані юзера вже є в AuthContext (завантажені при mount через GET /auth/me).
 *   Повторний запит тут — зайве навантаження.
 *   OrderHistory — окремий smart component з власним fetching.
 *
 * ProtectedRoute гарантує, що user != null при рендері.
 * Guard `if (!user) return null` — додатковий захист від race condition.
 */

import { LogOut, User, Mail, Shield, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { OrderHistory } from "../components/OrderHistory";
import type { BreadcrumbItem } from "../types/catalog";

/** Статичний масив для breadcrumbs — виноситься за межі компонента, щоб не re-create при рендері */
const BREADCRUMBS: BreadcrumbItem[] = [
    { label: "Головна", to: "/" },
    { label: "Профіль" },
];

/**
 * Один рядок у User Info Card: іконка + label + значення.
 * Маленький reusable sub-component замість copy-paste div для кожного поля.
 *
 * Використовує <dl>/<dt>/<dd> — семантична розмітка для пар ключ-значення (SEO + a11y).
 * wrap-break-word — щоб довгий email не зламав layout на мобільних.
 */
const InfoRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-3">
        <Icon
            size={16}
            className="mt-0.5 shrink-0 text-gray-500"
            aria-hidden="true"
        />
        <div className="min-w-0">
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-200 wrap-break-word">{value}</dd>
        </div>
    </div>
);

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Вихід: очищує AuthContext (token з localStorage + user state).
     * Header і BottomNavigation оновлюються автоматично через useAuth().
     * Redirect на "/" — щоб не залишати юзера на захищеній сторінці.
     */
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Додатковий guard: ProtectedRoute вже перевірив auth, але на всяк випадок
    if (!user) return null;

    /**
     * Форматуємо дату реєстрації у зрозумілий для юзера вигляд.
     * toLocaleDateString("uk-UA") → "01 грудня 2024".
     * Fallback "—" якщо поле відсутнє (legacy дані або помилка API).
     */
    const formattedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString("uk-UA", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "—";

    return (
        <main className="container mx-auto max-w-7xl px-4 py-6">
            {/* Хлібні крихти: "Головна > Профіль" — навігація та SEO */}
            <Breadcrumbs items={BREADCRUMBS} />

            <h1 className="mt-4 mb-6 text-2xl font-bold text-white">
                Мій профіль
            </h1>

            {/*
             * Desktop: grid з двома колонками — sidebar (280px, sticky) + content (1fr).
             * Mobile: grid з однією колонкою (sidebar зверху, orders знизу).
             * md:items-start — щоб sidebar не розтягувався по висоті контенту.
             */}
            <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-start">

                {/* ─── User Info Card (ліва колонка / sidebar) ─── */}
                <aside className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6 md:sticky md:top-6">

                    {/* Аватар-placeholder: перша літера імені замість реального фото (post-MVP) */}
                    <div className="mb-5 flex flex-col items-center gap-3">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/30 text-2xl font-bold text-violet-400 select-none"
                            aria-hidden="true"
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-white">
                                {user.name}
                            </p>
                            {/* Badge ролі — показуємо тільки адмінам */}
                            {user.role === "admin" && (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                                    <Shield size={10} aria-hidden="true" />
                                    Адміністратор
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Список реквізитів — <dl> для семантики пар ключ-значення */}
                    <dl className="space-y-3 border-t border-gray-700 pt-4">
                        <InfoRow icon={User} label="Ім'я" value={user.name} />
                        <InfoRow icon={Mail} label="Email" value={user.email} />
                        <InfoRow
                            icon={Calendar}
                            label="Зареєстрований з"
                            value={formattedDate}
                        />
                    </dl>

                    {/* Кнопка виходу — деструктивна дія, тому червоний колір */}
                    <button
                        onClick={handleLogout}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/40 py-2.5 text-sm font-medium text-red-400 transition-colors hover:border-red-700 hover:text-red-300"
                    >
                        <LogOut size={15} aria-hidden="true" />
                        Вийти з акаунту
                    </button>
                </aside>

                {/* ─── Секція замовлень (права колонка / основний контент) ─── */}
                {/*
                 * aria-labelledby пов'язує секцію з заголовком для скрін-рідерів.
                 * OrderHistory — smart component: сам завантажує та відображає замовлення.
                 */}
                <section aria-labelledby="orders-heading">
                    <h2
                        id="orders-heading"
                        className="mb-4 text-lg font-semibold text-white"
                    >
                        Мої замовлення
                    </h2>
                    <OrderHistory />
                </section>
            </div>
        </main>
    );
};
