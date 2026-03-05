import { Router, Request, Response } from "express";
import type { ResultSetHeader } from "mysql2";
import { pool } from "../database";

const router = Router();

// Отримати всі картки (або результати пошуку за ?q=)
router.get("/", async (req: Request, res: Response) => {
    try {
        const q =
            typeof req.query.q === "string" ? req.query.q.trim() : "";

        if (q === "") {
            const [rows] = await pool.query(
                "SELECT * FROM cards ORDER BY id DESC",
            );
            res.json(rows);
            return;
        }

        const [rows] = await pool.query(
            "SELECT * FROM cards WHERE title LIKE ? ORDER BY id DESC LIMIT 10",
            [`%${q}%`],
        );
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
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO cards (title, price, image) VALUES (?, ?, ?)",
            [title, price, image],
        );

        const newCard = {
            id: result.insertId,
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
        const [result] = await pool.query<ResultSetHeader>(
            "UPDATE cards SET title = ?, price = ?, image = ? WHERE id = ?",
            [title, price, image, id],
        );

        if (result.affectedRows === 0) {
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

    const cardId = parseInt(id, 10);
    if (isNaN(cardId)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
    }

    try {
        const [result] = await pool.query<ResultSetHeader>(
            "DELETE FROM cards WHERE id = ?",
            [cardId],
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Card not found" });
            return;
        }

        res.status(204).send();
    } catch (err) {
        console.error("DB deletion error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
