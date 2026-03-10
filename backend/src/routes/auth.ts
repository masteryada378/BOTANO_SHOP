import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../database";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    RegisterBody,
    LoginBody,
    JwtPayload,
    AuthenticatedRequest,
    UserRow,
} from "../types/auth";

const router = Router();

/**
 * Утиліта: генерує JWT токен для юзера.
 * Чому окрема функція?
 * — DRY: і register, і login потребують однакової генерації.
 *   Зміна алгоритму — в одному місці.
 */
const signToken = (userId: number, role: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!secret) {
        throw new Error("JWT_SECRET не встановлений");
    }

    const payload: JwtPayload = { userId, role };
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Базова валідація email через regexp.
 * Чому не складніший regexp?
 * — Для MVP достатньо перевірити наявність @ і домену.
 *   Повна валідація email — нескінченний rabbit hole.
 */
const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * POST /auth/register
 *
 * Реєстрація нового користувача.
 * Повертає JWT + дані юзера, щоб фронтенд одразу встановив auth state.
 *
 * Алгоритм:
 * 1. Валідація полів (обов'язковість, формат email, довжина пароля).
 * 2. Перевірка унікальності email (409 якщо вже існує).
 * 3. Хешування пароля через bcrypt (10 раундів).
 * 4. INSERT у БД.
 * 5. Генерація JWT.
 * 6. Відповідь 201 { token, user }.
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as RegisterBody;

    // Валідація: перевіряємо всі обов'язкові поля
    if (!name || !email || !password) {
        res.status(400).json({ message: "Усі поля обов'язкові: name, email, password" });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ message: "Невірний формат email" });
        return;
    }

    // Мінімум 6 символів — базова вимога безпеки для MVP
    if (password.length < 6) {
        res.status(400).json({ message: "Пароль має містити мінімум 6 символів" });
        return;
    }

    try {
        // Перевіряємо унікальність email перед INSERT
        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
        );
        if ((existing as unknown[]).length > 0) {
            res.status(409).json({ message: "Користувач з таким email вже існує" });
            return;
        }

        // 10 раундів — баланс між безпекою (> 8) та швидкістю (< 12)
        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            [name, email, passwordHash],
        );

        const insertId = (result as { insertId: number }).insertId;
        const token = signToken(insertId, "user");

        res.status(201).json({
            token,
            user: {
                id: insertId,
                name,
                email,
                role: "user",
            },
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Помилка сервера при реєстрації" });
    }
});

/**
 * POST /auth/login
 *
 * Вхід існуючого користувача.
 *
 * Security note: при невірних credentials відповідаємо однаковим
 * повідомленням "Невірний email або пароль" — не розкриваємо,
 * чи існує email (information disclosure prevention).
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
        res.status(400).json({ message: "Email і пароль обов'язкові" });
        return;
    }

    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
        );
        const users = rows as UserRow[];

        // Однакова відповідь для "не існує" і "неправильний пароль" — захист від enumeration
        if (users.length === 0) {
            res.status(401).json({ message: "Невірний email або пароль" });
            return;
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Невірний email або пароль" });
            return;
        }

        const token = signToken(user.id, user.role);

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Помилка сервера при вході" });
    }
});

/**
 * GET /auth/me
 *
 * Повертає дані поточного авторизованого юзера.
 * Фронтенд викликає при mount для відновлення auth state з localStorage token.
 *
 * authMiddleware: перевіряє JWT і прикріплює req.user.
 * Відповідь НЕ містить password_hash — тільки публічні поля.
 */
router.get(
    "/me",
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            // req.user гарантовано існує після authMiddleware
            const [rows] = await pool.query(
                "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
                [req.user!.id],
            );
            const users = rows as Omit<UserRow, "password_hash">[];

            if (users.length === 0) {
                // Токен валідний, але юзер видалений з БД
                res.status(401).json({ message: "Користувача не знайдено" });
                return;
            }

            res.status(200).json(users[0]);
        } catch (err) {
            console.error("Me error:", err);
            res.status(500).json({ message: "Помилка сервера" });
        }
    },
);

export default router;
