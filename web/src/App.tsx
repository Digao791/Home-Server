import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FilesPage } from './pages/FilesPage';
import { MainLayout } from './layouts/MainLayout';

function PlaceholderPage({ title }: { title: string }) {

    return (
        <div>
            <h1>{title}</h1>
            <p>Coming soon.</p>
        </div>
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

                <Route element={<MainLayout />}>

                    <Route
                        index
                        element={<DashboardPage />}
                    />

                    <Route
                        path="applications"
                        element={<ApplicationsPage />}
                    />

                    <Route
                        path="files"
                        element={<FilesPage />}
                    />

                    <Route
                        path="photos"
                        element={<PlaceholderPage title="Photos" />}
                    />

                    <Route
                        path="videos"
                        element={<PlaceholderPage title="Videos" />}
                    />

                    <Route
                        path="settings"
                        element={<PlaceholderPage title="Settings" />}
                    />

                </Route>

            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}