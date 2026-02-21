import { useState } from "react";

export default function AddProductForm() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(""); // Додано стан для зображення

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCard = {
            title,
            price: parseFloat(price),
            image, // Додано поле image
        };

        try {
            const res = await fetch("http://localhost:5005/cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCard),
            });

            if (res.ok) {
                alert("Картка успішно додана!");
                setTitle("");
                setPrice("");
                setImage(""); // Очищаємо поле зображення
                window.location.reload();
            } else {
                alert("Помилка при додаванні картки");
            }
        } catch (err) {
            console.error("Помилка запиту:", err);
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
