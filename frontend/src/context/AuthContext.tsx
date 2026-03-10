/**
 * AuthContext — глобальний стан автентифікації.
 *
 * Чому Context, а не Zustand?
 * — Для auth одного рівня складності React Context достатній.
 *   Стан простий: user | null, token | null, кілька методів.
 *
 * Ключові рішення:
 * — Token у localStorage: юзер не повинен логінитися після F5.
 * — isLoading під час перевірки токену: запобігає "flash of login page"
 *   (коли авторизований юзер бачить логін на долю секунди при перезавантаженні).
 * — fetchCurrentUser при mount: валідує збережений токен через сервер,
 *   а не довіряє localStorage сліпо.
 */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import type { User } from "../types/user";
import {
    loginUser,
    registerUser,
    fetchCurrentUser,
} from "../services/authService";

/** Ключ токену у localStorage з префіксом проєкту (аналогічно botano_cart) */
const TOKEN_KEY = "botano_token";

type AuthContextType = {
    /** Поточний авторизований юзер або null для гостя */
    user: User | null;
    /** JWT-токен або null */
    token: string | null;
    /** Зручний прапор: true якщо user !== null */
    isAuthenticated: boolean;
    /** true поки AuthProvider перевіряє токен при mount (запобігає flash of login page) */
    isLoading: boolean;
    /** Логін за email/password. Зберігає токен і встановлює user у стані. */
    login: (email: string, password: string) => Promise<void>;
    /** Реєстрація. Автоматичний вхід після успіху. */
    register: (name: string, email: string, password: string) => Promise<void>;
    /** Вихід: очищує токен з localStorage та скидає user у null */
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * При mount: якщо токен є у localStorage — перевіряємо його через GET /auth/me.
     * Якщо токен валідний — відновлюємо user state (сесія виживає після F5).
     * Якщо токен expired або невалідний — 401 → очищуємо localStorage тихо.
     * isLoading = true весь час перевірки → ProtectedRoute не робить передчасний redirect.
     */
    useEffect(() => {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        if (!savedToken) {
            setIsLoading(false);
            return;
        }

        setToken(savedToken);

        fetchCurrentUser()
            .then((fetchedUser) => {
                setUser(fetchedUser);
            })
            .catch(() => {
                // Токен невалідний або expired — очищуємо без шуму
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    /**
     * Спільна логіка після успішного login/register:
     * зберегти токен у localStorage і встановити стан.
     * useCallback щоб уникнути зайвих перерендерів залежних компонентів.
     */
    const handleAuthSuccess = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        setUser(newUser);
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            const response = await loginUser(email, password);
            handleAuthSuccess(response.token, response.user);
        },
        [handleAuthSuccess],
    );

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            const response = await registerUser(name, email, password);
            handleAuthSuccess(response.token, response.user);
        },
        [handleAuthSuccess],
    );

    const logout = useCallback(() => {
        // Видаляємо токен з localStorage — наступні api-запити підуть без Authorization
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: user !== null,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/** Хук для доступу до auth стану. Кидає помилку якщо використовується поза AuthProvider. */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
