import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';

import {
    ProtectedRoute
} from './components/ProtectedRoute';

import { useAuth } from './hooks/useAuth';

function Dashboard() {

    const { user, logout } = useAuth();

    return (
        <main style={{ padding: '32px' }}>

            <h1>Home-Lab Dashboard</h1>

            <p>Welcome, {user?.username}</p>

            <button onClick={() => {
                void logout().catch(console.error);
            }}>
                Logout
            </button>

        </main>
    );
}

export default function App() {

    return (
        <Routes>

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<ProtectedRoute />}>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}