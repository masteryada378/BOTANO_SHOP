import { Link } from "react-router-dom";
import { ImageOff, ShoppingCart } from "lucide-react";
import { cn } from "../lib/cn";
import { useAppContext } from "../context/AppContext";

interface CatalogCardProps {
    id: number;
    title: string;
    price: number;
    image?: string;
}

export const CatalogCard = ({ id, title, price, image }: CatalogCardProps) => {
    const { addToCart } = useAppContext();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addToCart(id);
    };

    return (
        <article
            className={cn(
                "flex flex-col rounded-xl border border-gray-700 bg-gray-800 overflow-hidden",
                "transition-all duration-200",
                "hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-900/20"
            )}
        >
            <Link
                to={`/product/${id}`}
                aria-label={`Переглянути деталі товару "${title}"`}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gray-700/50">
                        <ImageOff className="h-10 w-10 text-gray-500" aria-hidden="true" />
                    </div>
                )}

                <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-100 leading-snug">
                        {title}
                    </h3>
                    <p className="mt-1 font-mono text-sm font-bold text-violet-400">
                        {price} ₴
                    </p>
                </div>
            </Link>

            <div className="mt-auto px-3 pb-3">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    aria-label={`Додати "${title}" в кошик`}
                    className={cn(
                        "flex w-full items-center justify-center gap-2",
                        "rounded-lg bg-violet-600 py-2 text-sm font-medium text-white",
                        "transition-colors hover:bg-violet-500",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    )}
                >
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    В кошик
                </button>
            </div>
        </article>
    );
};

export const CatalogCardSkeleton = () => (
    <div className="flex flex-col rounded-xl border border-gray-700 bg-gray-800 overflow-hidden animate-pulse">
        <div className="h-48 w-full bg-gray-700" />
        <div className="p-3 flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-gray-700" />
            <div className="h-4 w-2/3 rounded bg-gray-700" />
            <div className="mt-1 h-4 w-1/3 rounded bg-gray-700" />
        </div>
        <div className="px-3 pb-3 mt-auto">
            <div className="h-9 w-full rounded-lg bg-gray-700" />
        </div>
    </div>
);
