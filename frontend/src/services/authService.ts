/**
 * Сервіс автентифікації — ізольований шар для API-запитів auth.
 *
 * Чому окремий сервіс?
 * — Ізоляція: якщо ендпоінт /auth/login зміниться — правимо один файл, а не шукаємо по компонентах.
 * — Типізація: кожна функція явно повертає типізований Promise — помилки типів на етапі компіляції.
 */

import { apiGet, apiPost } from "./api";
import type { AuthResponse, User } from "../types/user";

/** POST /auth/register — реєстрація нового юзера, повертає токен + user */
export const registerUser = (
    name: string,
    email: string,
    password: string,
): Promise<AuthResponse> =>
    apiPost<AuthResponse>("/auth/register", { name, email, password });

/** POST /auth/login — логін за email/password, повертає токен + user */
export const loginUser = (
    email: string,
    password: string,
): Promise<AuthResponse> =>
    apiPost<AuthResponse>("/auth/login", { email, password });

/**
 * GET /auth/me — отримати поточного юзера по токену.
 * Токен автоматично додається через api.ts (Authorization header).
 * Якщо токен expired або невалідний — бекенд поверне 401, api.ts кине Error.
 */
export const fetchCurrentUser = (): Promise<User> =>
    apiGet<User>("/auth/me");
