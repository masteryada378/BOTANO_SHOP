import ProductCard from "../components/ProductCard";
import AddProductForm from "../components/AddProductForm";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchCards } from "../services/cardService";
import { Card } from "../types/Card";

export default function Home() {
    const [products, setProducts] = useState<Card[]>([]);

    const loadProducts = async () => {
        try {
            const data = await fetchCards();
            setProducts(data);
        } catch (err) {
            console.error("Помилка при завантаженні карток:", err);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <MainLayout>
            <AddProductForm />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                ХОУМПЕЙДЖ
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        onUpdate={loadProducts}
                        onDelete={loadProducts}
                    />
                ))}
            </div>
        </MainLayout>
    );
}
