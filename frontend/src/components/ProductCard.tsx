type ProductProps = {
    title: string;
    price: number;
    image?: string;
};

export default function ProductCard({ title, price, image }: ProductProps) {
    return (
        <div className="border rounded-xl p-4 shadow hover:scale-105 transition">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-32 h-32 object-cover mb-4 rounded"
                />
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-green-700 font-bold mt-2">
                ${Number(price).toFixed(2)}
            </p>
        </div>
    );
}
