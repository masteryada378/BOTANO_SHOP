/**
 * Хелпери для безпечної роботи з localStorage.
 *
 * Чому не прямий localStorage.getItem/setItem?
 * — localStorage кидає виключення в Safari private mode і при переповненні квоти.
 *   Повторюваний try/catch + JSON.parse в кожному місці — DRY violation.
 *   Ці хелпери централізують обробку помилок і роблять контракт явним.
 *
 * Чому generic <T>?
 * — Дозволяє типізувати значення на стороні виклику без casting:
 *   getStorageItem<CartItem[]>("key", []) повертає CartItem[], а не unknown.
 */

/**
 * Читає і десеріалізує значення з localStorage.
 * Повертає fallback при відсутності ключа, corrupted JSON або недоступності API.
 */
export const getStorageItem = <T>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        // Corrupted JSON або Safari private mode — повертаємо fallback без краша
        return fallback;
    }
};

/**
 * Серіалізує і записує значення в localStorage.
 * Мовчки ігнорує помилки (quota exceeded, private mode).
 */
export const setStorageItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Quota exceeded або private mode — пропускаємо без краша
    }
};
