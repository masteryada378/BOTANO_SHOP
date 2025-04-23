import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import AddProductForm from "../components/AddProductForm";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    title: string;
    price: number;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Приклад запиту до бекенду
        fetch("http://localhost:5005/cards")
            .then((res) => res.json())
            .then((data) => {
                // Перетвори дані, якщо потрібно (наприклад, з поля title → name)
                const normalized = data.map((item: Product) => ({
                    id: item.id,
                    title: item.title,
                    price: item.price || 0,
                }));
                setProducts(normalized);
            })
            .catch((err) =>
                console.error("Помилка при завантаженні карток:", err)
            );
    }, []);

    return (
        <div>
            <Header />
            <AddProductForm />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.title}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}
