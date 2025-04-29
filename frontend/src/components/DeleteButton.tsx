import { deleteCard } from "../services/cardService";

interface DeleteButtonProps {
    cardId: number;
    onDelete: () => void;
}

const DeleteButton = ({ cardId, onDelete }: DeleteButtonProps) => {
    const handleDelete = async () => {
        const confirmed = confirm("Ви впевнені, що хочете видалити цей товар?");
        if (!confirmed) return;

        try {
            await deleteCard(cardId);
            onDelete();
        } catch (err) {
            console.error("Помилка при видаленні:", err);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
            Видалити
        </button>
    );
};

export default DeleteButton;
