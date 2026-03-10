/**
 * POST /orders — створення замовлення.
 *
 * Архітектура:
 * — Валідація payload → транзакція (INSERT orders + INSERT order_items) → 201.
 *
 * Чому транзакція?
 * — Атомарність: якщо INSERT в order_items зламається на третьому елементі,
 *   замовлення в orders автоматично відкочується. Не залишаємо "сирітські" записи.
 *
 * Чому total_price рахується на бекенді, а не береться з клієнта?
 * — Клієнтський total може бути підроблений. Бекенд перераховує суму з items
 *   (price × quantity) і зберігає власне значення. На production це мало б
 *   звірятися з цінами у БД — для MVP достатньо серверного перерахунку.
 */

import { Router, type Request, type Response } from "express";
import type { ResultSetHeader } from "mysql2";
import { pool } from "../database";

const router = Router();

/** Тип одного товару у замовленні */
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

/**
 * POST /orders
 * Створює замовлення з позиціями в одній транзакції.
 * Відповідь: 201 { id, status: "pending" } або 400/500 при помилці.
 */
router.post("/", async (req: Request<object, object, CreateOrderBody>, res: Response) => {
    const {
        customer_name,
        customer_phone,
        customer_email,
        delivery_method,
        delivery_address,
        payment_method,
        items,
    } = req.body;

    // ── Валідація ────────────────────────────────────────────────────────────
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

    // ── Транзакція ───────────────────────────────────────────────────────────
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Вставляємо замовлення
        const [orderResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO orders
             (customer_name, customer_phone, customer_email,
              delivery_method, delivery_address, payment_method, total_price)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_name.trim(),
                customer_phone.trim(),
                customer_email.trim(),
                delivery_method,
                delivery_address.trim(),
                payment_method,
                total_price,
            ],
        );

        const orderId = orderResult.insertId;

        // 2. Вставляємо всі позиції (один запит через VALUES batch)
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
});

export default router;
