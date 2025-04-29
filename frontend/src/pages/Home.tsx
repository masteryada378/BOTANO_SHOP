import ProductCard from "../components/ProductCard";
import AddProductForm from "../components/AddProductForm";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

interface Product {
    id: number;
    title: string;
    price: number;
    image?: string;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:5005/cards")
            .then((res) => res.json())
            .then((data) => {
                const normalized = data.map((item: Product) => ({
                    id: item.id,
                    title: item.title,
                    price: item.price || 0,
                    image: item.image,
                }));
                setProducts(normalized);
            })
            .catch((err) =>
                console.error("Помилка при завантаженні карток:", err)
            );
    }, []);

    return (
        <MainLayout>
            <AddProductForm />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.image}
                    />
                ))}
            </div>
        </MainLayout>
    );
}
