import { useState } from "react";
import { createCard } from "../services/cardService";

export default function AddProductForm() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // createCard повертає Promise<Card> — хардкод URL відсутній,
            // вся логіка транспорту інкапсульована у сервісі.
            await createCard({ title, price: parseFloat(price), image });
            alert("Картка успішно додана!");
            setTitle("");
            setPrice("");
            setImage("");
            window.location.reload();
        } catch (err) {
            console.error("Помилка запиту:", err);
            alert("Помилка при додаванні картки");
        }
    };

    const inputClass =
        "w-full rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 ring-1 ring-gray-700 outline-none focus:ring-violet-500 transition";

    return (
        <form
            onSubmit={handleSubmit}
            aria-label="Додати новий товар"
            className="rounded-xl border border-gray-700 bg-gray-800/50 p-5 space-y-3 max-w-lg"
        >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Додати товар
            </h2>
            <input
                type="text"
                placeholder="Назва товару (напр. Spider-Man #1)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                required
            />
            <input
                type="number"
                step="0.01"
                placeholder="Ціна, ₴"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
                required
            />
            <input
                type="url"
                placeholder="URL зображення"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputClass}
                required
            />
            <button
                type="submit"
                className="w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
                Додати товар
            </button>
        </form>
    );
}
