import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, JwtPayload } from "../types/auth";

/**
 * Опціональний middleware автентифікації.
 *
 * Відмінність від authMiddleware:
 * — authMiddleware: відсутній/невалідний токен → 401 (захищені маршрути).
 * — optionalAuthMiddleware: відсутній/невалідний токен → next() без req.user
 *   (маршрути, що підтримують і авторизованих юзерів, і гостей).
 *
 * Використовується для POST /orders:
 * — Авторизований юзер → req.user встановлюється → user_id зберігається в замовленні.
 * — Гість → req.user = undefined → user_id = NULL (guest checkout).
 */
export const optionalAuthMiddleware = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;

    // Токен відсутній або неправильний формат — пропускаємо без помилки
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next();
        return;
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;

    // JWT_SECRET не налаштований — ігноруємо токен, але не блокуємо запит
    if (!secret) {
        next();
        return;
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        // Токен валідний — прикріплюємо user до request
        req.user = { id: payload.userId, role: payload.role };
    } catch {
        // Невалідний або прострочений токен — просто ігноруємо, не повертаємо 401
        // req.user залишається undefined → route обробить як guest
    }

    next();
};
