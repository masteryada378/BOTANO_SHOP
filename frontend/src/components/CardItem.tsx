import { Card } from "../types/Card";
import { deleteCard } from "../services/cardService";

interface CardItemProps {
    card: Card;
    onEdit: (card: Card) => void;
    onDelete: () => void;
}

export const CardItem = ({ card, onEdit, onDelete }: CardItemProps) => {
    const handleDelete = async () => {
        if (confirm("Точно видалити цю картку?")) {
            await deleteCard(card.id);
            onDelete();
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm flex flex-col gap-2">
            <img
                src={card.image}
                alt={card.title}
                className="h-40 object-cover rounded"
            />
            <h3 className="text-lg font-bold">{card.title}</h3>
            <p className="text-gray-700">{card.price} ₴</p>
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(card)}
                    className="bg-yellow-400 px-2 py-1 rounded text-sm"
                >
                    Редагувати
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                    Видалити
                </button>
            </div>
        </div>
    );
};
