import { createContext, useContext, useState, ReactNode } from "react";

type AppContextType = {
    cart: number[];
    addToCart: (id: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<number[]>([]);

    const addToCart = (id: number) => {
        setCart((prev) => [...prev, id]);
    };

    return (
        <AppContext.Provider value={{ cart, addToCart }}>
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
