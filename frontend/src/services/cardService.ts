/**
 * Сервіс для роботи з ресурсом /cards.
 *
 * Чому окремий сервіс, а не fetch прямо в компоненті?
 * — Компонент відповідає за UI, сервіс — за транспорт даних (SRP).
 *   Якщо ендпоінт зміниться — правимо тут, а не шукаємо по JSX-файлах.
 *
 * Чому не хардкодимо "/cards" у кожному методі?
 * — Константа RESOURCE дає єдину точку перейменування ресурсу.
 */

import { Card } from "../types/Card";
import type { SortOption } from "../types/catalog";
import { apiDelete, apiGet, apiPost, apiPut } from "./api";

/** Базовий шлях ресурсу відносно VITE_API_URL */
const RESOURCE = "/cards";

/**
 * Отримати картки з опціональним сортуванням.
 *
 * Чому URLSearchParams?
 * — Безпечна побудова query string з автоматичним кодуванням значень.
 *   Легко розширити новими параметрами (page, limit, filters) без ручної конкатенації.
 */
export const fetchCards = (sort?: SortOption): Promise<Card[]> => {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return apiGet<Card[]>(qs ? `${RESOURCE}?${qs}` : RESOURCE);
};

/** Пошук карток за query (для live suggestions) */
export const searchCards = (query: string): Promise<Card[]> =>
  apiGet<Card[]>(`${RESOURCE}?q=${encodeURIComponent(query)}`);

/**
 * Оновити картку.
 * Повертаємо void — відповідь бекенду нас не цікавить, лише успіх/помилка.
 */
export const updateCard = (card: Card): Promise<void> =>
  apiPut<void>(`${RESOURCE}/${card.id}`, {
    title: card.title,
    price: card.price,
    image: card.image,
  });

/** Видалити картку за id */
export const deleteCard = (id: number): Promise<void> =>
  apiDelete(`${RESOURCE}/${id}`);

/**
 * Створити нову картку.
 * Omit<Card, "id"> — id генерує БД, тому не передаємо його з клієнта.
 */
export const createCard = (data: Omit<Card, "id">): Promise<Card> =>
  apiPost<Card>(RESOURCE, data);
