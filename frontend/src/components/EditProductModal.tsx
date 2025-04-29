import { Card } from "../types/Card";
import { useState } from "react";
import { updateCard } from "../services/cardService";

interface EditProductModalProps {
    card: Card;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const EditProductModal = ({
    card,
    isOpen,
    onClose,
    onUpdate,
}: EditProductModalProps) => {
    const [formData, setFormData] = useState<Card>(card);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await updateCard(formData);
        onUpdate();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl mb-4">Редагувати товар</h2>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Назва"
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Ціна"
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="URL картинки"
                    className="border p-2 mb-4 w-full"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Зберегти
                    </button>
                </div>
            </div>
        </div>
    );
};
