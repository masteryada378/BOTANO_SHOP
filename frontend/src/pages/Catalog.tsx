import { useCallback, useEffect, useState } from "react";
import { PackageOpen, RefreshCw } from "lucide-react";
import { CatalogCard, CatalogCardSkeleton } from "../components/CatalogCard";
import { fetchCards } from "../services/cardService";
import type { Card } from "../types/Card";

const SKELETON_COUNT = 8;

export const CatalogPage = () => {
    const [products, setProducts] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchCards();
            setProducts(data);
        } catch {
            setError("Не вдалося завантажити товари. Спробуйте пізніше.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <section aria-labelledby="catalog-heading" className="px-4 py-6 md:px-6">
            <header className="mb-6">
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
