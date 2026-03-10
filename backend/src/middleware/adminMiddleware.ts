import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";

/**
 * Middleware перевірки ролі адміністратора.
 *
 * Призначений для використання ПІСЛЯ authMiddleware в ланцюгу:
 *   router.post("/", authMiddleware, adminMiddleware, handler)
 *
 * SRP: authMiddleware перевіряє ідентичність (хто ти?),
 *      adminMiddleware перевіряє дозвіл (що тобі дозволено?).
 *
 * Бекенд — єдиний справжній рубіж захисту.
 * Навіть якщо фронтенд AdminRoute обійти через curl/Postman,
 * сервер поверне 403 без будь-якого доступу до даних.
 */
export const adminMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    // req.user встановлюється authMiddleware, який має йти першим у chain
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({
            message: "Доступ заборонено. Потрібна роль адміністратора.",
        });
        return;
    }

    next();
};
