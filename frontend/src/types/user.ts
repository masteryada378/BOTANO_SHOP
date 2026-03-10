/**
 * Доменні типи автентифікації.
 *
 * Чому окремий файл?
 * — User відноситься до іншого домену ніж Card чи CartItem.
 *   SRP: кожен файл у types/ описує одну доменну сутність.
 */

/** Авторизований користувач (без чутливих даних — password_hash ніколи не приходить з API) */
export interface User {
    id: number;
    name: string;
    email: string;
    /** Роль визначає доступ: user — звичайний покупець, admin — керування каталогом */
    role: "user" | "admin";
    created_at?: string;
}

/** Відповідь API після register/login: токен + дані юзера */
export interface AuthResponse {
    token: string;
    user: User;
}
