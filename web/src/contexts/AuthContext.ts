import { createContext } from 'react';

import type {
    User,
    LoginRequest
} from '../types/auth';

export interface AuthContextType {

    user: User | null;

    loading: boolean;

    isAuthenticated: boolean;

    login: (request: LoginRequest) => Promise<void>;

    logout: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );