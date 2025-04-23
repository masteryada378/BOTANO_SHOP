import ProductCard from "../../components/ProductCard";

const products = [
    {
        id: 1,
        name: "Фігурка Геральта",
        price: 1200,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Меч з Зельди",
        price: 1800,
        image: "https://via.placeholder.com/150",
    },
];

const ProductGrid = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                />
            ))}
        </div>
    );
};

export default ProductGrid;
