import {
    useEffect,
    useState
} from 'react';

import type { ReactNode } from 'react';

import { AuthContext } from './AuthContext';

import type {
    User,
    LoginRequest
} from '../types/auth';

import * as authApi from '../api/auth';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children
}: AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        let active = true;

        async function initializeAuth() {

            try {

                const currentUser =
                    await authApi.getCurrentUser();

                if (active) {
                    setUser(currentUser);
                }

            } catch {

                if (active) {
                    setUser(null);
                }

            } finally {

                if (active) {
                    setLoading(false);
                }
            }
        }

        void initializeAuth();

        return () => {
            active = false;
        };

    }, []);

    async function login(request: LoginRequest) {

        const authenticatedUser =
            await authApi.login(request);

        setUser(authenticatedUser);
    }

    async function logout() {

        await authApi.logout();

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: user !== null,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}