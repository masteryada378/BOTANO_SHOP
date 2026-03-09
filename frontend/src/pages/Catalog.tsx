/**
 * CatalogPage — сторінка каталогу товарів.
 *
 * Відповідальність:
 * - Керує станом завантаження, товарів, помилок та видимістю FilterDrawer.
 * - Синхронізує sort + фільтри з URL через useSearchParams.
 * - Передає параметри у fetchCards → бекенд повертає відфільтровані/відсортовані дані.
 */

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageOpen, RefreshCw } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CatalogCard, CatalogCardSkeleton } from "../components/CatalogCard";
import { CatalogToolbar } from "../components/CatalogToolbar";
import { FilterDrawer } from "../components/FilterDrawer";
import { fetchCards } from "../services/cardService";
import type { Card } from "../types/Card";
import type { BreadcrumbItem, CatalogFilters, SortOption } from "../types/catalog";
import { CATEGORIES, VALID_SORT_VALUES } from "../types/catalog";

const SKELETON_COUNT = 8;

/**
 * Парсимо sort з URL з валідацією.
 *
 * Чому не довіряємо URL напряму?
 * — Юзер може вручну написати ?sort=anything. Якщо значення невалідне —
 *   тихо повертаємо "newest" замість того щоб передати сміття у запит.
 */
const parseSortParam = (raw: string | null): SortOption => {
    if (raw && (VALID_SORT_VALUES as string[]).includes(raw)) {
        return raw as SortOption;
    }
    return "newest";
};

export const CatalogPage = () => {
    const [products, setProducts] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    /**
     * useSearchParams — єдине джерело правди для сортування і фільтрів.
     *
     * Чому URL, а не useState?
     * — URL дозволяє ділитися посиланням з конкретною фільтрацією,
     *   зберігає стан при F5 і коректно працює з кнопкою "Назад".
     */
    const [searchParams, setSearchParams] = useSearchParams();

    const currentSort = parseSortParam(searchParams.get("sort"));

    // Зчитуємо фільтри з URL — вони є джерелом правди для активного стану
    const activeFilters: CatalogFilters = {
        min_price: searchParams.get("min_price") ?? undefined,
        max_price: searchParams.get("max_price") ?? undefined,
        category: searchParams.get("category") ?? undefined,
    };

    /**
     * loadProducts залежить від усіх параметрів запиту.
     * useCallback перестворює функцію при кожній зміні URL-параметрів →
     * useEffect автоматично перезапускає завантаження.
     */
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchCards({
                sort: currentSort,
                ...activeFilters,
            });
            setProducts(data);
        } catch {
            setError("Не вдалося завантажити товари. Спробуйте пізніше.");
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentSort,
        activeFilters.min_price,
        activeFilters.max_price,
        activeFilters.category,
    ]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    /** При зміні сортування зберігаємо фільтри в URL (не скидаємо їх) */
    const handleSortChange = (sort: SortOption) => {
        const newParams = new URLSearchParams(searchParams);
        if (sort === "newest") {
            newParams.delete("sort");
        } else {
            newParams.set("sort", sort);
        }
        setSearchParams(newParams);
    };

    /**
     * При застосуванні фільтрів оновлюємо URL і закриваємо drawer.
     *
     * Чому новий URLSearchParams з нуля, а не клонування?
     * — Гарантуємо, що старі фільтри не "залишаться" в URL.
     *   Явно переносимо тільки sort і нові фільтри.
     */
    const handleFilterApply = (filters: CatalogFilters) => {
        const newParams = new URLSearchParams();
        if (currentSort !== "newest") newParams.set("sort", currentSort);
        if (filters.min_price) newParams.set("min_price", filters.min_price);
        if (filters.max_price) newParams.set("max_price", filters.max_price);
        if (filters.category) newParams.set("category", filters.category);
        setSearchParams(newParams);
        setIsFilterOpen(false);
    };

    /*
     * Breadcrumbs — динамічний ланцюжок залежно від активної категорії.
     *
     * Без фільтра: Головна > Каталог
     * З категорією: Головна > Каталог > Комікси
     *
     * CATEGORIES.find() перетворює value ("comics") у зрозумілий лейбл ("Комікси").
     * Якщо категорія невідома (ручне введення в URL) — показуємо raw value,
     * бо краще показати щось, ніж мовчки ігнорувати.
     */
    const categoryLabel = activeFilters.category
        ? (CATEGORIES.find((c) => c.value === activeFilters.category)?.label ??
          activeFilters.category)
        : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Головна", to: "/" },
        // Якщо є активна категорія — "Каталог" стає посиланням, інакше — поточна сторінка
        ...(categoryLabel
            ? [{ label: "Каталог", to: "/catalog" }, { label: categoryLabel }]
            : [{ label: "Каталог" }]),
    ];

    return (
        <>
            <section aria-labelledby="catalog-heading" className="px-4 py-6 md:px-6">
                {/* Breadcrumbs над заголовком — юзер бачить де він у структурі сайту */}
                <div className="mb-4">
                    <Breadcrumbs items={breadcrumbs} />
                </div>

                <header className="mb-4">
                    <h1
                        id="catalog-heading"
                        className="text-2xl font-bold text-gray-100"
                    >
                        Каталог товарів
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Обирай серед усіх доступних товарів
                    </p>
                </header>

                {/*
                 * Toolbar залишається видимим навіть під час loading —
                 * юзер бачить інструменти й може змінити сортування до завершення запиту.
                 * Лічильник показує null (→ "Завантаження...") поки isLoading.
                 */}
                <CatalogToolbar
                    totalCount={isLoading ? null : products.length}
                    currentSort={currentSort}
                    activeFilters={activeFilters}
                    onSortChange={handleSortChange}
                    onFilterClick={() => setIsFilterOpen(true)}
                />

                {error && (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                        <p className="text-gray-400">{error}</p>
                        <button
                            type="button"
                            onClick={loadProducts}
                            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                        >
                            <RefreshCw className="h-4 w-4" aria-hidden="true" />
                            Спробувати знову
                        </button>
                    </div>
                )}

                {!error && isLoading && (
                    <ul
                        aria-busy="true"
                        aria-label="Завантаження товарів"
                        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
                    >
                        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <li key={i}>
                                <CatalogCardSkeleton />
                            </li>
                        ))}
                    </ul>
                )}

                {!error && !isLoading && products.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
                        <PackageOpen className="h-12 w-12" aria-hidden="true" />
                        <p>Товарів поки немає</p>
                    </div>
                )}

                {!error && !isLoading && products.length > 0 && (
                    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <li key={product.id}>
                                <CatalogCard
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    image={product.image}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/*
             * FilterDrawer рендериться поза <section> щоб overlay перекривав увесь viewport.
             * Стан isFilterOpen живе в CatalogPage — він знає URL і керує даними.
             */}
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentFilters={activeFilters}
                onApply={handleFilterApply}
            />
        </>
    );
};
