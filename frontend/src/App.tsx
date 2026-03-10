import { AppRoutes } from "./routes/AppRoutes";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";

/**
 * AuthProvider огортає AppProvider і AppRoutes:
 * — useAuth() доступний у всіх компонентах (Header, BottomNavigation, ProtectedRoute).
 * — AppProvider всередині AuthProvider: порядок не критичний (вони незалежні),
 *   але auth — більш глобальна обгортка логічно.
 */
function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
