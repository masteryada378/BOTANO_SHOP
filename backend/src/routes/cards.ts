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

/**
 * GET /cards — список карток з підтримкою фільтрів, пошуку та сортування.
 *
 * Query params:
 *   ?q=         — текстовий пошук по полю title (LIKE)
 *   ?sort=      — сортування (price_asc | price_desc | newest | oldest)
 *   ?min_price= — мінімальна ціна (price >= ?)
 *   ?max_price= — максимальна ціна (price <= ?)
 *   ?category=  — фільтр за категорією (category = ?)
 *
 * Чому динамічний масив conditions?
 * — Кількість активних фільтрів невідома заздалегідь. Масив дозволяє
 *   накопичувати умови і з'єднати їх через AND в кінці — без if-else гілок
 *   для кожної комбінації фільтрів.
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const q =
            typeof req.query.q === "string" ? req.query.q.trim() : "";
        const rawSort =
            typeof req.query.sort === "string" ? req.query.sort : "";
        const orderBy = ORDER_MAP[rawSort] ?? ORDER_MAP.newest;

        // Зчитуємо фільтри з query params
        const rawMinPrice =
            typeof req.query.min_price === "string" ? req.query.min_price : "";
        const rawMaxPrice =
            typeof req.query.max_price === "string" ? req.query.max_price : "";
        const category =
            typeof req.query.category === "string" ? req.query.category.trim() : "";

        /**
         * Валідація числових фільтрів.
         *
         * Чому Number() + isNaN(), а не parseInt()?
         * — parseInt("100abc") === 100 — тихо ігнорує суфікс.
         *   Number("100abc") === NaN — строга перевірка.
         *   Невалідне значення просто ігнорується (не 400 error),
         *   щоб не ламати запити зі старими/неповними URL.
         */
        const minPrice = rawMinPrice && !isNaN(Number(rawMinPrice))
            ? Number(rawMinPrice)
            : null;
        const maxPrice = rawMaxPrice && !isNaN(Number(rawMaxPrice))
            ? Number(rawMaxPrice)
            : null;

        // Накопичуємо умови WHERE та параметри для prepared statement
        const conditions: string[] = [];
        const params: (string | number)[] = [];

        if (q) {
            conditions.push("title LIKE ?");
            params.push(`%${q}%`);
        }
        if (minPrice !== null) {
            conditions.push("price >= ?");
            params.push(minPrice);
        }
        if (maxPrice !== null) {
            conditions.push("price <= ?");
            params.push(maxPrice);
        }
        if (category) {
            conditions.push("category = ?");
            params.push(category);
        }

        let sql = "SELECT * FROM cards";
        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        // orderBy береться виключно з ORDER_MAP — безпечно підставляти в рядок
        sql += ` ORDER BY ${orderBy}`;

        // При текстовому пошуку обмежуємо результати (live suggestions)
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
