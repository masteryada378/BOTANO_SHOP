import { useEffect, useState } from "react";
import { fetchCards } from "../services/cardService";
import { Card } from "../types/Card";
import ProductCard from "../components/ProductCard";
import AddProductForm from "../components/AddProductForm";

const SKELETON_COUNT = 6;

const ProductSkeleton = () => (
    <div className="animate-pulse rounded-xl bg-gray-800 p-4 flex flex-col gap-3">
        <div className="h-40 w-full rounded-lg bg-gray-700" />
        <div className="h-4 w-3/4 rounded bg-gray-700" />
        <div className="h-4 w-1/3 rounded bg-gray-700" />
        <div className="mt-auto flex gap-2">
            <div className="h-8 flex-1 rounded bg-gray-700" />
            <div className="h-8 flex-1 rounded bg-gray-700" />
        </div>
    </div>
);

export default function Home() {
    const [products, setProducts] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCards();
            setProducts(data);
        } catch (err) {
            console.error("Помилка при завантаженні карток:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <section aria-labelledby="catalog-heading">
            <header className="mb-8">
                <h1
                    id="catalog-heading"
                    className="text-2xl font-bold text-white sm:text-3xl"
                >
                    Каталог товарів
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    Комікси, фігурки, девайси — все для справжніх гіків
                </p>
            </header>

            <AddProductForm />

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {isLoading
                    ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                          <ProductSkeleton key={i} />
                      ))
                    : products.map((product) => (
                          <ProductCard
                              key={product.id}
                              {...product}
                              onUpdate={loadProducts}
                              onDelete={loadProducts}
                          />
                      ))}
            </div>

            {!isLoading && products.length === 0 && (
                <p className="mt-16 text-center text-gray-500">
                    Товарів поки немає. Додайте перший!
                </p>
            )}
        </section>
    );
}
