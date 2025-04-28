type ProductProps = {
    title: string;
    price: number;
};

export default function ProductCard({ title, price }: ProductProps) {
    return (
        <div className="border rounded-xl p-4 shadow hover:scale-105 transition">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-green-700 font-bold mt-2">
                ${Number(price).toFixed(2)}
            </p>
        </div>
    );
}
