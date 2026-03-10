/**
 * Маршрути замовлень.
 *
 * POST   /orders     — створення замовлення (гість або авторизований юзер).
 * GET    /orders     — список замовлень поточного авторизованого юзера.
 * GET    /orders/:id — деталі одного замовлення з позиціями (тільки власник).
 *
 * Чому транзакція для POST?
 * — Атомарність: якщо INSERT в order_items зламається — orders теж відкочується.
 *   Не залишаємо "сирітські" записи без позицій.
 *
 * Чому total_price рахується на бекенді?
 * — Клієнтський total може бути підроблений. Бекенд перераховує з items (price × quantity).
 *
 * Чому ownership check у GET /orders/:id повертає 404, а не 403?
 * — 403 розкриває існування ресурсу. 404 не дає зловмиснику знати,
 *   чи замовлення взагалі існує (security through obscurity).
 */

import { Router, type Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database";
import { authMiddleware } from "../middleware/authMiddleware";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware";
import type { AuthenticatedRequest } from "../types/auth";

const router = Router();

/** Один товар у запиті на створення замовлення */
interface OrderItem {
    product_id: number;
    title: string;
    price: number;
    quantity: number;
}

/** Тіло запиту POST /orders */
interface CreateOrderBody {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_method: string;
    delivery_address: string;
    payment_method: string;
    items: OrderItem[];
}

/** Рядок orders із БД (для GET-запитів) */
interface OrderRow extends RowDataPacket {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_method: string;
    delivery_address: string;
    payment_method: string;
    total_price: number;
    status: string;
    created_at: string;
    user_id: number | null;
    items_count?: number;
}

/** Позиція замовлення із БД */
interface OrderItemRow extends RowDataPacket {
    id: number;
    order_id: number;
    product_id: number;
    title: string;
    price: number;
    quantity: number;
}

/**
 * POST /orders
 *
 * Створює замовлення з позиціями в одній транзакції.
 *
 * optionalAuthMiddleware: якщо токен валідний → req.user встановлено → зберігаємо user_id.
 * Якщо токен відсутній або невалідний → req.user = undefined → user_id = NULL (guest checkout).
 *
 * Відповідь: 201 { id, status: "pending" } або 400/500 при помилці.
 */
router.post(
    "/",
    optionalAuthMiddleware,
    async (
        req: AuthenticatedRequest & { body: CreateOrderBody },
        res: Response,
    ) => {
        const {
            customer_name,
            customer_phone,
            customer_email,
            delivery_method,
            delivery_address,
            payment_method,
            items,
        } = req.body;

        // ── Валідація ────────────────────────────────────────────────────────
        if (!items || items.length === 0) {
            res.status(400).json({ message: "Кошик порожній — items не можуть бути відсутніми" });
            return;
        }

        const requiredFields = [
            customer_name,
            customer_phone,
            customer_email,
            delivery_method,
            delivery_address,
            payment_method,
        ];

        if (requiredFields.some((f) => !f || String(f).trim() === "")) {
            res.status(400).json({ message: "Усі обов'язкові поля мають бути заповнені" });
            return;
        }

        // Серверний перерахунок суми — захист від підробки на клієнті
        const total_price = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );

        // user_id береться з req.user (якщо авторизований) або NULL (гість)
        const userId = req.user?.id ?? null;

        // ── Транзакція ───────────────────────────────────────────────────────
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Вставляємо замовлення з опціональним user_id
            const [orderResult] = await connection.query<ResultSetHeader>(
                `INSERT INTO orders
                 (customer_name, customer_phone, customer_email,
                  delivery_method, delivery_address, payment_method,
                  total_price, user_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    customer_name.trim(),
                    customer_phone.trim(),
                    customer_email.trim(),
                    delivery_method,
                    delivery_address.trim(),
                    payment_method,
                    total_price,
                    userId,
                ],
            );

            const orderId = orderResult.insertId;

            // Вставляємо всі позиції одним batch-запитом
            const itemValues = items.map((item) => [
                orderId,
                item.product_id,
                item.title,
                item.price,
                item.quantity,
            ]);

            await connection.query(
                `INSERT INTO order_items (order_id, product_id, title, price, quantity)
                 VALUES ?`,
                [itemValues],
            );

            await connection.commit();

            res.status(201).json({ id: orderId, status: "pending" });
        } catch (err) {
            // Відкочуємо транзакцію при будь-якій помилці
            await connection.rollback();
            console.error("❌ Order creation failed:", err);
            res.status(500).json({ message: "Помилка при створенні замовлення" });
        } finally {
            // Повертаємо з'єднання у пул незалежно від результату
            connection.release();
        }
    },
);

/**
 * GET /orders
 *
 * Повертає список замовлень поточного авторизованого юзера.
 * authMiddleware обов'язковий — гості отримують 401.
 *
 * items_count — кількість позицій через LEFT JOIN + COUNT, без окремого запиту.
 * GROUP BY o.id — обов'язковий при агрегації з JOIN.
 * ORDER BY created_at DESC — новіші замовлення першими (стандарт e-commerce).
 */
router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    try {
        const [orders] = await pool.query<OrderRow[]>(
            `SELECT
                o.id,
                o.total_price,
                o.status,
                o.created_at,
                COUNT(oi.id) AS items_count
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId],
        );

        res.json(orders);
    } catch (err) {
        console.error("❌ Fetch orders failed:", err);
        res.status(500).json({ message: "Помилка при отриманні замовлень" });
    }
});

/**
 * GET /orders/:id
 *
 * Повертає деталі одного замовлення разом із позиціями.
 * authMiddleware обов'язковий.
 *
 * Чому перевірка user_id у SQL, а не після отримання?
 * — Ownership check вбудований у WHERE o.id = ? AND o.user_id = ?
 *   Один запит замість двох (select → check → select items).
 *   Якщо не знайдено — 404 (не розкриваємо, чи замовлення взагалі існує).
 */
router.get("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const orderId = Number(req.params.id);
    const userId = req.user!.id;

    if (isNaN(orderId)) {
        res.status(400).json({ message: "Невалідний ID замовлення" });
        return;
    }

    try {
        // Отримуємо замовлення тільки якщо воно належить поточному юзеру
        const [orders] = await pool.query<OrderRow[]>(
            `SELECT
                id, customer_name, customer_phone, customer_email,
                delivery_method, delivery_address, payment_method,
                total_price, status, created_at
             FROM orders
             WHERE id = ? AND user_id = ?`,
            [orderId, userId],
        );

        if (orders.length === 0) {
            // 404 замість 403 — не розкриваємо існування замовлення
            res.status(404).json({ message: "Замовлення не знайдено" });
            return;
        }

        const order = orders[0];

        // Отримуємо позиції замовлення
        const [items] = await pool.query<OrderItemRow[]>(
            `SELECT id, product_id, title, price, quantity
             FROM order_items
             WHERE order_id = ?`,
            [orderId],
        );

        res.json({ ...order, items });
    } catch (err) {
        console.error("❌ Fetch order by id failed:", err);
        res.status(500).json({ message: "Помилка при отриманні замовлення" });
    }
});

export default router;
