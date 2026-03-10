/**
 * AppContext — глобальний стан кошика.
 *
 * Чому Context, а не Zustand/Redux?
 * — Для кошика одного рівня складності React Context цілком достатній.
 *   Немає сенсу додавати залежності заради features, які нам не потрібні.
 *
 * Ключові рішення:
 * — CartItem (не number[]) — зберігаємо повну інформацію для рендеру без API.
 * — Price snapshot — ціна фіксується на момент додавання (стандарт e-commerce).
 * — localStorage persist — кошик виживає після F5, закриття вкладки, перезапуску.
 * — Computed values — totalItems і totalPrice не дублюються в state,
 *   а обчислюються з cart (похідні дані не мають власного useState).
 */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { CartItem } from "../types/Cart";
import { getStorageItem, setStorageItem } from "../lib/storage";

/** Ключ у localStorage з префіксом проєкту, щоб не конфліктувати з іншими app на localhost */
const CART_KEY = "botano_cart";

type AppContextType = {
    cart: CartItem[];
    /** Додати товар. Якщо товар з таким id вже є — збільшити quantity. */
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    /** Видалити позицію з кошика повністю */
    removeFromCart: (id: number) => void;
    /** Змінити кількість. При quantity <= 0 — видаляє позицію. */
    updateQuantity: (id: number, quantity: number) => void;
    /** Очистити кошик повністю */
    clearCart: () => void;
    /** Сума кількостей усіх позицій (для badge у Header/BottomNav) */
    totalItems: number;
    /** Загальна сума кошика price × quantity (для сторінки кошика та checkout) */
    totalPrice: number;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    /**
     * Lazy initializer useState — getStorageItem викликається один раз при монтуванні.
     * Якщо localStorage порожній або corrupted — повертає [] (безпечний fallback).
     */
    const [cart, setCart] = useState<CartItem[]>(() =>
        getStorageItem<CartItem[]>(CART_KEY, []),
    );

    /**
     * Синхронізуємо кошик у localStorage після кожної зміни.
     * useEffect з [cart] — запускається тільки при реальній зміні, не при монтуванні.
     */
    useEffect(() => {
        setStorageItem(CART_KEY, cart);
    }, [cart]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id);
            if (existing) {
                // Товар вже є — збільшуємо кількість, не дублюємо позицію
                return prev.map((c) =>
                    c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
                );
            }
            // Новий товар — додаємо з quantity: 1 і price snapshot з параметра
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((c) => c.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            // Кількість <= 0 — автоматично видаляємо позицію
            removeFromCart(id);
            return;
        }
        setCart((prev) =>
            prev.map((c) => (c.id === id ? { ...c, quantity } : c)),
        );
    };

    const clearCart = () => setCart([]);

    // Computed values — похідні від cart, не окремий state
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return (
        <AppContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error("useAppContext must be used within AppProvider");
    return context;
};
