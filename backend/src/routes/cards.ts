import { Router } from "express";
import { pool } from "../database";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cards ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

router.post("/", async (req, res) => {
    const { title, price } = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO cards (title, price) VALUES (?, ?)",
            [title, price]
        );

        const newCard = {
            id: (result as any).insertId, // отримуємо новий ID
            title,
            price,
        };

        res.status(201).json(newCard);
    } catch (err) {
        console.error("DB чогось error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
