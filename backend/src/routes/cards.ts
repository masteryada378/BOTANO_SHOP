import { Router, Request, Response } from "express";
import { pool } from "../database";

const router = Router();

// Отримати всі картки
router.get("/", async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cards ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Створити нову картку
router.post("/", async (req: Request, res: Response) => {
    const { title, price, image } = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO cards (title, price, image) VALUES (?, ?, ?)",
            [title, price, image]
        );

        const newCard = {
            id: (result as any).insertId,
            title,
            price,
            image,
        };

        res.status(201).json(newCard);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Оновити картку
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { title, price, image } = req.body;

    try {
        const [result] = await pool.query(
            "UPDATE cards SET title = ?, price = ?, image = ? WHERE id = ?",
            [title, price, image, id]
        );

        if ((result as any).affectedRows === 0) {
            res.status(404).json({ error: "Card not found" });
            return;
        }

        res.status(200).json({ id, title, price, image });
        return;
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
        return;
    }
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    console.log("Received DELETE for ID:", id); // Логування отриманого ID

    // Конвертація в число з перевіркою
    const cardId = parseInt(id, 10);
    if (isNaN(cardId)) {
        console.error("Invalid ID format:", id);
        res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const [result] = await pool.query("DELETE FROM cards WHERE id = ?", [
            cardId,
        ]);
        console.log("DB result:", result); // Логування результату запиту

        if ((result as any).affectedRows === 0) {
            console.log("No card found with ID:", cardId);
            res.status(404).json({ error: "Card not found" });
        }

        console.log("Successfully deleted card ID:", cardId);
        res.status(204).send();
    } catch (err) {
        console.error("DB deletion error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
