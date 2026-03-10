import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, JwtPayload } from "../types/auth";

/**
 * Middleware автентифікації через JWT.
 *
 * Чому middleware, а не перевірка в кожному route?
 * — DRY: підключається одним рядком: router.get("/me", authMiddleware, handler).
 *   Центральна точка для зміни логіки перевірки токену.
 *
 * Алгоритм:
 * 1. Зчитати заголовок Authorization.
 * 2. Перевірити формат "Bearer <token>".
 * 3. Верифікувати токен через jwt.verify (перевіряє підпис + expiration).
 * 4. Прикріпити { id, role } до req.user для використання в handlers.
 * 5. При будь-якій помилці — 401 Unauthorized.
 */
export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;

    // Перевіряємо наявність і формат заголовка
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Токен відсутній або неправильний формат" });
        return;
    }

    const token = authHeader.slice(7); // Відрізаємо "Bearer "
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        // JWT_SECRET не встановлений — критична конфігураційна помилка
        res.status(500).json({ message: "Сервер не налаштований для автентифікації" });
        return;
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        // Прикріплюємо дані юзера до request для використання в наступних handlers
        req.user = { id: payload.userId, role: payload.role };
        next();
    } catch {
        // TokenExpiredError, JsonWebTokenError — обидва → 401
        res.status(401).json({ message: "Токен недійсний або прострочений" });
    }
};
