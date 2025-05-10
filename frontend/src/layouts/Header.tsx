import { useAppContext } from "../../context/AppContext";

const Header = () => {
    const { cart } = useAppContext();

    return (
        <header className="bg-gray-800 text-white p-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">GameGear Shop</h1>
                <div>🛒 Кошик: {cart.length}</div>
            </div>
        </header>
    );
};

export default Header;
