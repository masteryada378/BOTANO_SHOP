import DeleteButton from "./DeleteButton";
import { useState } from "react";
import { EditProductModal } from "./EditProductModal";
import { Card } from "../types/Card";

interface ProductCardProps extends Card {
    onUpdate: () => void;
    onDelete: () => void;
}

export default function ProductCard({
    id,
    title,
    price,
    image,
    onUpdate,
    onDelete,
}: ProductCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <article className="flex flex-col rounded-xl border border-gray-700 bg-gray-800 p-4 transition hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-900/20">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="h-40 w-full rounded-lg object-cover mb-3"
                />
            )}
            <h3 className="text-base font-semibold text-gray-100">{title}</h3>
            <p className="mt-1 font-mono text-sm font-bold text-violet-400">
                {price} ₴
            </p>

            <div className="flex gap-2 mt-auto pt-4">
                <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex-1 rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-600 transition-colors"
                >
                    Редагувати
                </button>
                <DeleteButton cardId={id} onDelete={onDelete} />
            </div>

            <EditProductModal
                card={{ id, title, price, image }}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onUpdate={onUpdate}
            />
        </article>
    );
}
