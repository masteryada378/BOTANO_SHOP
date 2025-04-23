type ProductProps = {
    name: string;
    price: number;
};

export default function ProductCard({ name, price }: ProductProps) {
    return (
        <div className="border rounded-xl p-4 shadow hover:scale-105 transition">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-green-700 font-bold mt-2">${price.toFixed(2)}</p>
        </div>
    );
}
