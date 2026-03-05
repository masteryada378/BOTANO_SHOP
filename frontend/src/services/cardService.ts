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
import { apiDelete, apiGet, apiPost, apiPut } from "./api";

/** Базовий шлях ресурсу відносно VITE_API_URL */
const RESOURCE = "/cards";

/** Отримати всі картки */
export const fetchCards = (): Promise<Card[]> =>
  apiGet<Card[]>(RESOURCE);

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
