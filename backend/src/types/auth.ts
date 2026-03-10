import { Request } from "express";

/**
 * Тіло запиту на реєстрацію.
 * Всі три поля обов'язкові — валідація на рівні route перед DB-запитом.
 */
export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

/**
 * Тіло запиту на логін.
 * Тільки email + password — name не потрібен для ідентифікації.
 */
export interface LoginBody {
    email: string;
    password: string;
}

/**
 * Payload, що зберігається всередині JWT.
 * Мінімальний набір: id і роль достатні для authMiddleware + adminMiddleware.
 * Ніколи не зберігаємо пароль або чутливі дані в токені.
 */
export interface JwtPayload {
    userId: number;
    role: string;
}

/**
 * Розширений тип Request для захищених маршрутів.
 * authMiddleware декодує JWT і прикріплює user до req.
 * Усі захищені handlers приймають AuthenticatedRequest замість Request.
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

/**
 * Рядок запису users з БД.
 * Повертається з SELECT-запитів. password_hash ніколи не передається клієнту.
 */
export interface UserRow {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: "user" | "admin";
    created_at: string;
}
