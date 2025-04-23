import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

export default function Home() {
    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                <ProductCard name="Іграшковий мох" price={12.99} />
                <ProductCard name="Сувенірна квітка" price={9.49} />
                <ProductCard name="Геймерський кактус" price={15.0} />
            </div>
        </div>
    );
}
