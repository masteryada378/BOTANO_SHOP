/**
 * Централізований HTTP-клієнт.
 *
 * Чому окремий модуль?
 * — Єдина точка для baseURL, заголовків та обробки помилок.
 *   Якщо завтра бекенд переїде на інший порт або домен —
 *   міняємо лише .env, а не шукаємо хардкод по всьому проєкту.
 *
 * Чому не axios?
 * — Нативний fetch покриває наші потреби без зайвої залежності.
 *   axios додає ~14 KB до бандлу і абстракцію, яка тут не потрібна.
 *
 * Чому generic <T>?
 * — Кожен виклик явно вказує очікуваний тип відповіді (наприклад Card[]).
 *   Компілятор ловить невідповідності на етапі збірки, а не в рантаймі.
 */

/**
 * baseURL береться виключно з env-змінної VITE_API_URL.
 * Vite підставляє значення під час збірки (статично),
 * тому рядок "localhost:5005" ніколи не потрапляє у вихідний код.
 *
 * Якщо змінна не задана — падаємо одразу з зрозумілою помилкою,
 * а не отримуємо загадковий "Failed to fetch" у рантаймі.
 */
const BASE_URL = import.meta.env.VITE_API_URL;

console.log(BASE_URL);

if (!BASE_URL) {
    throw new Error(
        "[api] VITE_API_URL is not defined. " +
            "Add it to your .env file (see .env.example).",
    );
}

/**
 * Внутрішня функція-обгортка над fetch.
 * Всі публічні методи (get/post/put/delete) делегують сюди.
 *
 * Чому окрема функція request()?
 * — DRY: логіка перевірки статусу і парсингу JSON в одному місці.
 *   Якщо треба додати токен авторизації — додаємо тут один раз.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;

    /**
     * Токен читається з localStorage при КОЖНОМУ запиті (не кешується у змінній модуля).
     * Це гарантує актуальний токен після login/logout без потреби оновлювати зовнішній стан.
     * Ключ botano_token — з префіксом проєкту, аналогічно botano_cart.
     */
    const token = localStorage.getItem("botano_token");
    const authHeader: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader,
            ...options.headers,
        },
        ...options,
    });

    // HTTP 4xx/5xx не кидають виключення у fetch — перевіряємо вручну.
    // Централізована перевірка тут означає, що сервіси не дублюють цю логіку.
    if (!response.ok) {
        throw new Error(
            `[api] ${options.method ?? "GET"} ${url} → ${response.status} ${response.statusText}`,
        );
    }

    // HTTP 204 No Content — тіло відсутнє, повертаємо void-сумісне значення.
    // Тип T у таких викликах має бути void або undefined.
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

/** GET /path → T */
export const apiGet = <T>(path: string): Promise<T> => request<T>(path);

/** POST /path з JSON-тілом → T */
export const apiPost = <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) });

/** PUT /path з JSON-тілом → T */
export const apiPut = <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) });

/** DELETE /path → void */
export const apiDelete = (path: string): Promise<void> =>
    request<void>(path, { method: "DELETE" });
