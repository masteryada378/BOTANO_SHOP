import { useState } from "react";

export default function AddProductForm() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCard = {
            title,
            price: parseFloat(price),
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
                window.location.reload(); // оновлюємо дані (опціонально)
            } else {
                alert("Помилка при додаванні картки");
            }
        } catch (err) {
            console.error("Помилка запиту:", err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 space-y-4 max-w-md mx-auto"
        >
            <input
                type="text"
                placeholder="Назва товару"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="number"
                step="0.01"
                placeholder="Ціна"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Додати товар
            </button>
        </form>
    );
}
