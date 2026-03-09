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
import type { CatalogFilters, SortOption } from "../types/catalog";
import { apiDelete, apiGet, apiPost, apiPut } from "./api";

/** Базовий шлях ресурсу відносно VITE_API_URL */
const RESOURCE = "/cards";

/**
 * Параметри запиту карток.
 *
 * Чому об'єкт замість окремих аргументів?
 * — З ростом кількості фільтрів окремі аргументи (sort, min, max, category, ...)
 *   стають некерованими. Об'єкт масштабується, читається, деструктурується.
 *   Зміна сигнатури не зламає місця виклику (можна додати нові поля без рефактору).
 */
export interface FetchCardsParams extends CatalogFilters {
    sort?: SortOption;
}

/**
 * Отримати картки з опціональними фільтрами та сортуванням.
 *
 * Чому URLSearchParams?
 * — Безпечна побудова query string з автоматичним кодуванням значень.
 *   Немає ризику XSS через ручну конкатенацію рядків.
 */
export const fetchCards = (params?: FetchCardsParams): Promise<Card[]> => {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.set("sort", params.sort);
    if (params?.min_price) searchParams.set("min_price", params.min_price);
    if (params?.max_price) searchParams.set("max_price", params.max_price);
    if (params?.category) searchParams.set("category", params.category);
    const qs = searchParams.toString();
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
