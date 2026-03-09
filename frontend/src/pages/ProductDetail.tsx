/**
 * ProductDetail (PDP — Product Detail Page).
 *
 * Чому PDP важлива?
 * — Тут юзер приймає рішення "купити чи ні". Без цієї сторінки магазин —
 *   просто список карток без контексту. PDP показує повну інформацію:
 *   зображення, ціну, знижку, бренд, наявність, опис.
 *
 * Layout:
 * — Mobile-first: зображення зверху, інфо знизу (stack).
 * — Desktop (md+): два стовпці — зображення ліворуч, інфо праворуч.
 *
 * SEO:
 * — <article> як семантичний контейнер товару.
 * — <h1> для назви (єдиний h1 на сторінці).
 * — alt на <img> для індексації зображень.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { fetchCardById } from "../services/cardService";
import { useAppContext } from "../context/AppContext";
import type { Card } from "../types/Card";
import { cn } from "../lib/cn";

// ─── Skeleton ────────────────────────────────────────────────────────────────

/**
 * Скелетон-заглушка під час завантаження.
 * Повторює структуру реального контенту щоб уникнути layout shift (CLS).
 */
const ProductDetailSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid gap-8 md:grid-cols-2">
            {/* Зображення */}
            <div className="aspect-square w-full rounded-xl bg-gray-800" />

            {/* Текстова інфо */}
            <div className="flex flex-col gap-4">
                <div className="h-4 w-24 rounded bg-gray-700" />
                <div className="h-8 w-3/4 rounded bg-gray-700" />
                <div className="h-8 w-1/3 rounded bg-gray-700" />
                <div className="h-5 w-28 rounded bg-gray-700" />
                <div className="mt-4 flex gap-3">
                    <div className="h-12 flex-1 rounded-xl bg-gray-700" />
                    <div className="h-12 w-12 rounded-xl bg-gray-700" />
                </div>
                {/* Опис */}
                <div className="mt-2 flex flex-col gap-2">
                    <div className="h-4 w-full rounded bg-gray-700" />
                    <div className="h-4 w-full rounded bg-gray-700" />
                    <div className="h-4 w-2/3 rounded bg-gray-700" />
                </div>
            </div>
        </div>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useAppContext();

    const [product, setProduct] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // id може бути undefined якщо маршрут налаштовано некоректно
        if (!id) {
            setError("Не вказано ID товару");
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        const loadProduct = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchCardById(id);
                if (!cancelled) setProduct(data);
            } catch {
                // При 404 або помилці мережі — показуємо зрозумілий стан
                if (!cancelled) setError("Товар не знайдено або виникла помилка");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadProduct();

        // Cleanup запобігає запису стану після unmount або зміни id
        return () => {
            cancelled = true;
        };
    }, [id]);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                {/*
                 * Скелетон breadcrumbs під час loading.
                 * Займає місце реального компонента — запобігає layout shift (CLS),
                 * коли контент з'являється і все "стрибає" вниз.
                 */}
                <div className="mb-6 h-4 w-48 animate-pulse rounded bg-gray-800" />
                <ProductDetailSkeleton />
            </main>
        );
    }

    // ── Error / Not found ────────────────────────────────────────────────────
    if (error || !product) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-16 text-center">
                <p className="text-lg text-gray-400">{error ?? "Товар не знайдено"}</p>
                <Link
                    to="/catalog"
                    className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                >
                    Повернутися до каталогу
                </Link>
            </main>
        );
    }

    // ── Discount calculation ─────────────────────────────────────────────────
    /**
     * Відсоток знижки розраховується лише якщо old_price > price.
     * Math.round — щоб уникнути дробових відсотків типу "-33.333%".
     */
    const hasDiscount =
        product.old_price != null && product.old_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.old_price! - product.price) / product.old_price!) * 100)
        : 0;

    const isAvailable = product.in_stock !== false;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            {/*
             * Breadcrumbs: Головна > Каталог > Назва товару.
             * Рендеримо після завантаження — маємо product.title для останньої крихти.
             * mb-6 — відступ від breadcrumbs до основного контенту.
             */}
            <div className="mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Головна", to: "/" },
                        { label: "Каталог", to: "/catalog" },
                        { label: product.title },
                    ]}
                />
            </div>

            {/*
             * <article> — семантичний контейнер одного товару (SEO + a11y).
             * grid gap-8 md:grid-cols-2 — stack на мобілці, 2 колонки на desktop.
             */}
            <article className="grid gap-8 md:grid-cols-2">

                {/* ── Image ─────────────────────────────────────────────── */}
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-800">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        // Placeholder якщо товар не має зображення
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageOff className="h-20 w-20 text-gray-600" aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* ── Product info ───────────────────────────────────────── */}
                <div className="flex flex-col gap-4">

                    {/* Бренд */}
                    {product.brand && (
                        <p className="text-sm font-medium uppercase tracking-wider text-violet-400">
                            {product.brand}
                        </p>
                    )}

                    {/* Назва — єдиний h1 на сторінці (SEO) */}
                    <h1 className="text-2xl font-bold leading-tight text-white">
                        {product.title}
                    </h1>

                    {/* Ціновий блок */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/*
                         * font-mono — "гік-акцент" для ціни (JetBrains Mono якщо підключено).
                         * emerald-400 — виразний акцент, що не конфліктує з violet-акцентом UI.
                         */}
                        <span className="font-mono text-3xl font-bold text-emerald-400">
                            {product.price.toLocaleString("uk-UA")} ₴
                        </span>

                        {/* Стара ціна з перекресленням */}
                        {hasDiscount && (
                            <span className="font-mono text-lg text-gray-500 line-through">
                                {product.old_price!.toLocaleString("uk-UA")} ₴
                            </span>
                        )}

                        {/* Бейдж знижки — видимий тільки при наявності акції */}
                        {hasDiscount && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                -{discountPercent}%
                            </span>
                        )}
                    </div>

                    {/* Статус наявності */}
                    <p
                        className={cn(
                            "text-sm font-medium",
                            isAvailable ? "text-green-400" : "text-red-400",
                        )}
                    >
                        {isAvailable ? "✓ В наявності" : "✗ Немає в наявності"}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        {/*
                         * Кнопка "Додати в кошик".
                         * disabled + opacity-50 якщо товару немає — не дозволяємо
                         * додавати відсутні товари, щоб не вводити юзера в оману.
                         */}
                        <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => addToCart(product.id)}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-lg font-semibold text-white transition-colors",
                                isAvailable
                                    ? "bg-violet-600 hover:bg-violet-500"
                                    : "cursor-not-allowed bg-gray-700 opacity-50",
                            )}
                        >
                            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                            Додати в кошик
                        </button>

                        {/*
                         * Кнопка вибраного (Wishlist).
                         * Функціональність — Task #22+ (AuthContext + Profile).
                         * Зараз console.log, щоб зберегти місце в UI без dead code.
                         */}
                        <button
                            type="button"
                            onClick={() => console.log("TODO: wishlist", product.id)}
                            aria-label="Додати до вибраного"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-700 text-gray-400 transition-colors hover:border-violet-500 hover:text-violet-400"
                        >
                            <Heart className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Опис товару — рендеримо тільки якщо є, не залишаємо порожню секцію */}
                    {product.description && (
                        <div className="mt-2 border-t border-gray-700 pt-4">
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                                Про товар
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-300">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>
            </article>
        </main>
    );
};
