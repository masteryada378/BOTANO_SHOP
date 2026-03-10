/**
 * AdminPage — сторінка керування каталогом товарів.
 *
 * Доступна тільки для role=admin (захист через AdminRoute + adminMiddleware).
 * Перевикористовує існуючі компоненти AddProductForm, EditProductModal, DeleteButton
 * — не дублюємо логіку, тільки компонуємо в новому контексті.
 *
 * Layout:
 * - Заголовок + badge "Адміністратор".
 * - Toolbar: кількість товарів + кнопка "Додати товар".
 * - Форма додавання (collapsible, схована за замовчуванням).
 * - Таблиця на desktop / картки на mobile (responsive grid).
 */

import { useEffect, useState, useCallback } from "react";
import { Shield, Plus, X, Package } from "lucide-react";
import { fetchCards } from "../services/cardService";
import { Card } from "../types/Card";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EditProductModal } from "../components/EditProductModal";
import DeleteButton from "../components/DeleteButton";
import { formatPrice } from "../lib/formatPrice";

/** Кількість skeleton-рядків під час завантаження */
const SKELETON_ROWS = 5;

// ─── Форма додавання товару ───────────────────────────────────────────────────

interface AddFormState {
    title: string;
    price: string;
    image: string;
    category: string;
}

const EMPTY_FORM: AddFormState = {
    title: "",
    price: "",
    image: "",
    category: "",
};

/**
 * Inline форма для додавання нового товару.
 * Виведена в окремий sub-компонент щоб не захаращувати AdminPage.
 * onSuccess — колбек після успішного додавання (перезавантажує список).
 */
const AddProductInlineForm = ({
    onSuccess,
    onCancel,
}: {
    onSuccess: () => void;
    onCancel: () => void;
}) => {
    const [form, setForm] = useState<AddFormState>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Динамічний імпорт щоб уникнути циклічних залежностей при tree-shaking
            const { createCard } = await import("../services/cardService");
            await createCard({
                title: form.title.trim(),
                price: parseFloat(form.price),
                image: form.image.trim() || undefined,
                category: form.category.trim() || undefined,
            });
            setForm(EMPTY_FORM);
            onSuccess();
        } catch {
            setError("Помилка при додаванні товару. Спробуйте ще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 ring-1 ring-gray-700 outline-none focus:ring-violet-500 transition";

    return (
        <form
            onSubmit={handleSubmit}
            aria-label="Форма додавання товару"
            className="rounded-xl border border-violet-500/30 bg-gray-800/50 p-5 space-y-3"
        >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                Новий товар
            </h3>

            {/* Назва + категорія в ряд на desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                    type="text"
                    name="title"
                    placeholder="Назва товару *"
                    value={form.title}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    minLength={2}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Категорія (Comics, Figures...)"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                />
            </div>

            {/* Ціна + URL зображення в ряд на desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                    type="number"
                    name="price"
                    placeholder="Ціна, ₴ *"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    className={inputClass}
                    required
                />
                <input
                    type="url"
                    name="image"
                    placeholder="URL зображення"
                    value={form.image}
                    onChange={handleChange}
                    className={inputClass}
                />
            </div>

            {/* Повідомлення про помилку */}
            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Скасувати
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? "Додавання..." : "Додати товар"}
                </button>
            </div>
        </form>
    );
};

// ─── Skeleton рядок ───────────────────────────────────────────────────────────

const TableRowSkeleton = () => (
    <tr className="animate-pulse border-t border-gray-800">
        <td className="px-4 py-3">
            <div className="h-10 w-10 rounded bg-gray-700" />
        </td>
        <td className="px-4 py-3">
            <div className="h-4 w-40 rounded bg-gray-700" />
        </td>
        <td className="px-4 py-3">
            <div className="h-4 w-20 rounded bg-gray-700" />
        </td>
        <td className="px-4 py-3">
            <div className="h-4 w-24 rounded bg-gray-700" />
        </td>
        <td className="px-4 py-3">
            <div className="flex gap-2">
                <div className="h-7 w-20 rounded bg-gray-700" />
                <div className="h-7 w-20 rounded bg-gray-700" />
            </div>
        </td>
    </tr>
);

// ─── Мобільна картка товару ───────────────────────────────────────────────────

/**
 * На мобілках таблиця незручна — відображаємо картки.
 * Видно через md:hidden на обгортці.
 */
const MobileProductCard = ({
    card,
    onEdit,
    onDelete,
}: {
    card: Card;
    onEdit: (card: Card) => void;
    onDelete: () => void;
}) => (
    <li className="rounded-xl border border-gray-800 bg-gray-800/50 p-4 flex gap-3">
        {/* Thumbnail */}
        <div className="shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-gray-700">
            {card.image ? (
                <img
                    src={card.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Package size={20} className="text-gray-500" />
                </div>
            )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{card.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
                {card.category ?? "—"} · ID #{card.id}
            </p>
            <p className="text-sm font-semibold text-violet-400 mt-1">
                {formatPrice(card.price)}
            </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
            <button
                onClick={() => onEdit(card)}
                className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            >
                Редагувати
            </button>
            <DeleteButton cardId={card.id} onDelete={onDelete} />
        </div>
    </li>
);

// ─── Головний компонент ───────────────────────────────────────────────────────

export const AdminPage = () => {
    const [products, setProducts] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);

    /**
     * useCallback стабілізує посилання на функцію між рендерами.
     * Це запобігає зайвим ефектам при передачі loadProducts у children.
     */
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchCards();
            setProducts(data);
        } catch {
            setError("Не вдалося завантажити товари. Перевірте з'єднання.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleAddSuccess = () => {
        setIsAddFormOpen(false);
        loadProducts();
    };

    const handleEditOpen = (card: Card) => {
        setEditingCard(card);
    };

    const handleEditClose = () => {
        setEditingCard(null);
    };

    const handleEditUpdate = () => {
        setEditingCard(null);
        loadProducts();
    };

    return (
        <section aria-labelledby="admin-heading" className="pb-8">
            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: "Головна", to: "/" },
                    { label: "Адмін-панель" },
                ]}
            />

            {/* Заголовок */}
            <header className="mt-4 mb-6 flex items-center gap-3">
                <h1
                    id="admin-heading"
                    className="text-2xl font-bold text-white sm:text-3xl"
                >
                    Адмін-панель
                </h1>
                {/* Role badge — підкреслює, що ця сторінка для адмінів */}
                <span className="flex items-center gap-1.5 rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-400">
                    <Shield size={12} aria-hidden="true" />
                    Адміністратор
                </span>
            </header>

            {/* Toolbar: лічильник + кнопка "Додати" */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-400">
                    {isLoading ? (
                        <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
                    ) : (
                        <>
                            Товарів у каталозі:{" "}
                            <span className="font-semibold text-white">
                                {products.length}
                            </span>
                        </>
                    )}
                </p>
                <button
                    onClick={() => setIsAddFormOpen((prev) => !prev)}
                    aria-expanded={isAddFormOpen}
                    aria-controls="add-product-form"
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
                >
                    {isAddFormOpen ? (
                        <>
                            <X size={16} aria-hidden="true" />
                            Закрити
                        </>
                    ) : (
                        <>
                            <Plus size={16} aria-hidden="true" />
                            Додати товар
                        </>
                    )}
                </button>
            </div>

            {/* Collapsible форма додавання */}
            {isAddFormOpen && (
                <div id="add-product-form" className="mb-6">
                    <AddProductInlineForm
                        onSuccess={handleAddSuccess}
                        onCancel={() => setIsAddFormOpen(false)}
                    />
                </div>
            )}

            {/* Стан помилки */}
            {error && (
                <div
                    role="alert"
                    className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
                >
                    {error}
                    <button
                        onClick={loadProducts}
                        className="ml-3 underline hover:no-underline"
                    >
                        Спробувати ще
                    </button>
                </div>
            )}

            {/* ── Таблиця для desktop ──────────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800/60 text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-16">
                                Фото
                            </th>
                            <th scope="col" className="px-4 py-3">
                                Назва
                            </th>
                            <th scope="col" className="px-4 py-3">
                                Ціна
                            </th>
                            <th scope="col" className="px-4 py-3">
                                Категорія
                            </th>
                            <th scope="col" className="px-4 py-3">
                                Дії
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading
                            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                                  <TableRowSkeleton key={i} />
                              ))
                            : products.map((card) => (
                                  <tr
                                      key={card.id}
                                      className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors"
                                  >
                                      {/* Thumbnail */}
                                      <td className="px-4 py-3">
                                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-700">
                                              {card.image ? (
                                                  <img
                                                      src={card.image}
                                                      alt=""
                                                      className="h-full w-full object-cover"
                                                      loading="lazy"
                                                  />
                                              ) : (
                                                  <div className="flex h-full items-center justify-center">
                                                      <Package
                                                          size={14}
                                                          className="text-gray-500"
                                                      />
                                                  </div>
                                              )}
                                          </div>
                                      </td>

                                      {/* Назва + ID */}
                                      <td className="px-4 py-3">
                                          <p className="font-medium text-white">
                                              {card.title}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                              ID #{card.id}
                                          </p>
                                      </td>

                                      {/* Ціна */}
                                      <td className="px-4 py-3 font-semibold text-violet-400">
                                          {formatPrice(card.price)}
                                      </td>

                                      {/* Категорія */}
                                      <td className="px-4 py-3 text-gray-400">
                                          {card.category ?? (
                                              <span className="text-gray-600">—</span>
                                          )}
                                      </td>

                                      {/* Дії: Редагувати + Видалити */}
                                      <td className="px-4 py-3">
                                          <div className="flex gap-2">
                                              <button
                                                  onClick={() => handleEditOpen(card)}
                                                  className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                                              >
                                                  Редагувати
                                              </button>
                                              <DeleteButton
                                                  cardId={card.id}
                                                  onDelete={loadProducts}
                                              />
                                          </div>
                                      </td>
                                  </tr>
                              ))}

                        {/* Стан порожнього каталогу */}
                        {!isLoading && products.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-16 text-center text-gray-500"
                                >
                                    <Package
                                        size={40}
                                        className="mx-auto mb-3 opacity-30"
                                    />
                                    <p>Каталог порожній. Додайте перший товар.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Картки для mobile ────────────────────────────────────── */}
            <ul className="flex flex-col gap-3 md:hidden" aria-label="Список товарів">
                {isLoading
                    ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                          <li
                              key={i}
                              className="animate-pulse rounded-xl border border-gray-800 bg-gray-800/50 h-24"
                          />
                      ))
                    : products.map((card) => (
                          <MobileProductCard
                              key={card.id}
                              card={card}
                              onEdit={handleEditOpen}
                              onDelete={loadProducts}
                          />
                      ))}

                {/* Стан порожнього каталогу на mobile */}
                {!isLoading && products.length === 0 && (
                    <li className="py-16 text-center text-gray-500">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p>Каталог порожній. Додайте перший товар.</p>
                    </li>
                )}
            </ul>

            {/* EditProductModal — рендериться поза таблицею/списком щоб не порушувати DOM */}
            {editingCard && (
                <EditProductModal
                    card={editingCard}
                    isOpen={true}
                    onClose={handleEditClose}
                    onUpdate={handleEditUpdate}
                />
            )}
        </section>
    );
};
