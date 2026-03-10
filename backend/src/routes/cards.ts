import { Router, Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

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

/**
 * GET /cards/:id — отримати один товар за його ID.
 *
 * Чому цей route стоїть перед PUT /:id та DELETE /:id?
 * — Express перебирає маршрути зверху вниз. GET /:id має бути оголошений
 *   раніше PUT і DELETE з тим самим параметром, щоб не конкурувати з ними.
 *
 * Чому 404, а не порожній масив?
 * — HTTP-семантика: ресурс не знайдено = 404. Frontend може показати
 *   зрозуміле повідомлення "Товар не знайдено" замість пустої сторінки.
 *
 * Чому RowDataPacket?
 * — mysql2 повертає рядки як масив RowDataPacket. Явна типізація замість
 *   unknown[] або any[] дає автодоповнення і ловить помилки на етапі збірки.
 */
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const cardId = parseInt(req.params.id, 10);

    // Валідуємо ID до запиту в БД — уникаємо зайвого DB-round-trip
    if (isNaN(cardId)) {
        res.status(400).json({ message: "Невалідний ID товару" });
        return;
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM cards WHERE id = ?",
            [cardId],
        );

        if (rows.length === 0) {
            res.status(404).json({ message: "Товар не знайдено" });
            return;
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("DB error (GET /cards/:id):", err);
        res.status(500).json({ error: "Database error" });
    }
});

/**
 * POST /cards — створити товар.
 * PUT /cards/:id — оновити товар.
 * DELETE /cards/:id — видалити товар.
 *
 * Chain: authMiddleware → adminMiddleware → handler.
 * authMiddleware перевіряє токен і встановлює req.user.
 * adminMiddleware перевіряє req.user.role === 'admin'.
 * GET-ендпоінти залишаються публічними — каталог доступний всім.
 */
router.post("/", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    /**
     * Деструктуруємо всі поля, що можуть надійти від адмін-форми.
     * old_price і in_stock — опціональні (nullable/default у БД).
     */
    const { title, price, image, category, description, brand, old_price, in_stock } = req.body;

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO cards
             (title, price, image, category, description, brand, old_price, in_stock)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                price,
                image ?? null,
                category ?? null,
                description ?? null,
                brand ?? null,
                old_price ?? null,
                // Конвертуємо boolean/string в 0/1 для MySQL TINYINT
                in_stock !== undefined ? (in_stock ? 1 : 0) : 1,
            ],
        );

        res.status(201).json({
            id: result.insertId,
            title,
            price,
            image,
            category,
            description,
            brand,
            old_price,
            in_stock,
        });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Оновити картку (тільки admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    /**
     * Приймаємо всі поля картки.
     * Undefined-значення перетворюємо на null, щоб очищувати поля при потребі.
     */
    const { title, price, image, category, description, brand, old_price, in_stock } = req.body;

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE cards
             SET title = ?, price = ?, image = ?,
                 category = ?, description = ?, brand = ?,
                 old_price = ?, in_stock = ?
             WHERE id = ?`,
            [
                title,
                price,
                image ?? null,
                category ?? null,
                description ?? null,
                brand ?? null,
                old_price ?? null,
                in_stock !== undefined ? (in_stock ? 1 : 0) : 1,
                id,
            ],
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Card not found" });
            return;
        }

        res.status(200).json({ id, title, price, image, category, description, brand, old_price, in_stock });
        return;
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
        return;
    }
});

// Видалити картку (тільки admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: Request<{ id: string }>, res: Response) => {
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
