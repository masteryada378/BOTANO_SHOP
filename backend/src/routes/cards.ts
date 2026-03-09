import { Router, Request, Response } from "express";
import type { ResultSetHeader } from "mysql2";
import { pool } from "../database";

const router = Router();

/**
 * Маппінг допустимих значень ?sort= на SQL ORDER BY.
 *
 * Чому маппінг, а не підстановка user input?
 * — ORDER BY не можна параметризувати через ? placeholder у MySQL.
 *   Маппінг гарантує, що в SQL потрапить тільки одне з наших рядків,
 *   а не довільний рядок від клієнта (захист від SQL-ін'єкції).
 */
const ORDER_MAP: Record<string, string> = {
    price_asc: "price ASC",
    price_desc: "price DESC",
    newest: "id DESC",
    oldest: "id ASC",
};

// Отримати картки: підтримка ?q= (пошук) та ?sort= (сортування)
router.get("/", async (req: Request, res: Response) => {
    try {
        const q =
            typeof req.query.q === "string" ? req.query.q.trim() : "";

        // Зчитуємо sort із запиту; якщо не вказано або невалідне — дефолт "newest"
        const rawSort =
            typeof req.query.sort === "string" ? req.query.sort : "";
        const orderBy = ORDER_MAP[rawSort] ?? ORDER_MAP.newest;

        // Будуємо запит динамічно, щоб не дублювати логіку для випадків з/без ?q=
        let sql = "SELECT * FROM cards";
        const params: string[] = [];

        if (q) {
            sql += " WHERE title LIKE ?";
            params.push(`%${q}%`);
        }

        // orderBy береться виключно з ORDER_MAP — безпечно вставляти в рядок
        sql += ` ORDER BY ${orderBy}`;

        // При пошуку обмежуємо до 10 результатів (live suggestions)
        if (q) {
            sql += " LIMIT 10";
        }

        const [rows] = await pool.query(sql, params);
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
