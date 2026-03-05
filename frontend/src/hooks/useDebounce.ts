import { useState, useEffect } from "react";

/**
 * Генерить "відкладену" версію значення, що оновлюється лише через delayMs
 * після останньої зміни вхідного value.
 *
 * @param value - вхідне значення (string, number тощо)
 * @param delayMs - затримка в мілісекундах (рекомендовано 300ms для пошуку)
 * @returns debounced-версія значення
 */
export function useDebounce<T>(value: T, delayMs: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debouncedValue;
}
