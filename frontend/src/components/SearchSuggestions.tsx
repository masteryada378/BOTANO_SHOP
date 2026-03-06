/**
 * SearchSuggestions — компонент випадаючого списку підказок пошуку.
 *
 * Відповідальність (SRP):
 * — отримати debouncedQuery від Header,
 * — зробити запит до API,
 * — відобразити стани: loading / empty / результати.
 *
 * Header відповідає за стан пошуку (open/close, query value).
 * Цей компонент відповідає тільки за дані і їх відображення.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchCards } from "../services/cardService";
import { Card } from "../types/Card";

interface SearchSuggestionsProps {
  /** Дебаунсований рядок пошуку, що надходить з Header */
  query: string;
  /** Колбек, що викликається при кліку на підказку — Header закриє dropdown */
  onSelect: () => void;
}

export const SearchSuggestions = ({
  query,
  onSelect,
}: SearchSuggestionsProps) => {
  const [results, setResults] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Мінімальна довжина запиту — 2 символи (стандарт autocomplete).
    // Менше — скидаємо стан і не ходимо на сервер.
    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Прапорець "cancelled" вирішує race condition:
    // якщо юзер швидко змінює запит, відповідь попереднього fetch
    // може прийти пізніше за нову — не записуємо застарілі дані.
    let cancelled = false;

    const fetchSuggestions = async () => {
      setIsLoading(true);

      try {
        const data = await searchCards(query);

        // Записуємо результат лише якщо ефект ще актуальний
        if (!cancelled) {
          setResults(data);
        }
      } catch {
        // При помилці мережі просто очищаємо список — не ламаємо UI
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSuggestions();

    // Cleanup — запускається перед кожним наступним ефектом або unmount.
    // Встановлює cancelled = true, щоб попередній fetch не записав результат.
    return () => {
      cancelled = true;
    };
  }, [query]);

  // Нема сенсу рендерити якщо запит надто короткий
  if (query.trim().length < 2) return null;

  return (
    /*
     * Контейнер dropdown.
     * w-full — розтягується на ширину батька (блоку пошуку в Header).
     * mt-1 — невеликий відступ від інпуту.
     * max-h-80 + overflow-y-auto — обмежуємо висоту на малих екранах.
     */
    <div className="w-full mt-1 rounded-lg border border-gray-700 bg-gray-800 shadow-xl overflow-hidden">
      {/* aria-live="polite" — скрінрідер озвучить зміну стану без переривання */}
      <div aria-live="polite" className="sr-only">
        {isLoading && "Шукаємо..."}
        {!isLoading && results.length === 0 && `Нічого не знайдено за запитом ${query}`}
        {!isLoading && results.length > 0 && `Знайдено ${results.length} результатів`}
      </div>

      {/* Стан завантаження */}
      {isLoading && (
        <div className="px-4 py-3 text-sm text-gray-400">Шукаємо...</div>
      )}

      {/* Порожній результат (після завантаження) */}
      {!isLoading && results.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-400">
          Нічого не знайдено за запитом{" "}
          <span className="text-gray-200">«{query}»</span>
        </div>
      )}

      {/* Список підказок */}
      {!isLoading && results.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          aria-label="Результати пошуку"
          className="max-h-80 overflow-y-auto divide-y divide-gray-700/50"
        >
          {results.map((card) => (
            <li key={card.id} role="option" aria-selected={false}>
              {/*
               * Link огортає весь рядок підказки.
               * При кліку → onSelect() закриє dropdown у Header,
               * react-router зробить перехід на /product/:id.
               */}
              <Link
                to={`/product/${card.id}`}
                onClick={onSelect}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700 transition-colors"
              >
                {/* Мініатюра товару (40×40px), якщо зображення є */}
                <div className="shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-700">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    /* Заглушка без зображення — нейтральний квадрат */
                    <div className="h-full w-full bg-gray-600" />
                  )}
                </div>

                {/* Текстова інформація про товар */}
                <div className="flex-1 min-w-0">
                  {/* truncate запобігає виходу довгої назви за межі */}
                  <p className="text-sm text-gray-100 truncate">{card.title}</p>
                  {/* font-mono — "гік" акцент для ціни, violet — accent color проекту */}
                  <p className="text-xs font-mono text-violet-400 mt-0.5">
                    {card.price.toLocaleString("uk-UA")} ₴
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
