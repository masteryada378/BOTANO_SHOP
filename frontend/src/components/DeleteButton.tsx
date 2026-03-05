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
            className="flex-1 rounded-md bg-red-900/60 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-700 hover:text-white transition-colors"
        >
            Видалити
        </button>
    );
};

export default DeleteButton;
