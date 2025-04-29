import { useEffect, useState } from "react";
import { Card } from "../types/Card";
import { fetchCards } from "../services/cardService";
import { CardItem } from "./CardItem";
import { EditProductModal } from "./EditProductModal";
import { useModal } from "../hooks/useModal";

export const CardList = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const { isOpen, openModal, closeModal } = useModal();

    const loadCards = async () => {
        const data = await fetchCards();
        setCards(data);
    };

    useEffect(() => {
        loadCards();
    }, []);

    const handleEdit = (card: Card) => {
        setSelectedCard(card);
        openModal();
    };

    const handleDelete = () => {
        loadCards();
    };

    const handleUpdate = () => {
        loadCards();
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {cards.map((card) => (
                <CardItem
                    key={card.id}
                    card={card}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}

            {selectedCard && (
                <EditProductModal
                    card={selectedCard}
                    isOpen={isOpen}
                    onClose={closeModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};
