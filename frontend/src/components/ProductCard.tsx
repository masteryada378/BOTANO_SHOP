import DeleteButton from "./DeleteButton";
import { useState } from "react";
import { EditProductModal } from "./EditProductModal";
import { Card } from "../types/Card";
// import { deleteCard } from "../services/cardService";

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

    // const handleDelete = async () => {
    //     try {
    //         await deleteCard(id);
    //         onDelete();
    //     } catch (err) {
    //         console.error("Помилка видалення:", err);
    //     }
    // };

    return (
        <div className="border p-4 rounded shadow bg-white flex flex-col items-center">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="h-40 object-cover mb-2"
                />
            )}
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-700">{price} грн</p>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => setIsEditOpen(true)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
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
        </div>
    );
}
