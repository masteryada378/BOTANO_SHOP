/**
 * CatalogPage — сторінка каталогу товарів.
 *
 * Відповідальність:
 * - Керує станом завантаження, товарів та помилок.
 * - Синхронізує параметр sort з URL через useSearchParams.
 * - Передає sort у fetchCards → бекенд повертає відсортовані дані.
 */

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageOpen, RefreshCw } from "lucide-react";
import { CatalogCard, CatalogCardSkeleton } from "../components/CatalogCard";
import { CatalogToolbar } from "../components/CatalogToolbar";
import { fetchCards } from "../services/cardService";
import type { Card } from "../types/Card";
import type { SortOption } from "../types/catalog";
import { VALID_SORT_VALUES } from "../types/catalog";

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

    // useSearchParams — зберігає стан сортування в URL (стандарт для каталогів)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentSort = parseSortParam(searchParams.get("sort"));

    /**
     * loadProducts залежить від currentSort — при зміні URL-параметра
     * useCallback отримає нову функцію → useEffect перезапустить завантаження.
     */
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchCards(currentSort);
            setProducts(data);
        } catch {
            setError("Не вдалося завантажити товари. Спробуйте пізніше.");
        } finally {
            setIsLoading(false);
        }
    }, [currentSort]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    /** При зміні сортування оновлюємо URL — без перезавантаження сторінки */
    const handleSortChange = (sort: SortOption) => {
        setSearchParams({ sort });
    };

    return (
        <section aria-labelledby="catalog-heading" className="px-4 py-6 md:px-6">
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
                onSortChange={handleSortChange}
                onFilterClick={() =>
                    // TODO Task #13: відкривати filter drawer
                    console.log("TODO: open filter drawer")
                }
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
    );
};
