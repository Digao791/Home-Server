import {
    apiRequest,
    refreshCsrf,
    clearCsrf
} from './client';

import type {
    User,
    LoginRequest
} from '../types/auth';

export async function login(
    request: LoginRequest
): Promise<User> {

    await refreshCsrf();

    const body = new URLSearchParams();

    body.set('username', request.username);
    body.set('password', request.password);

    await apiRequest<void>('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type':
                'application/x-www-form-urlencoded'
        },
        body
    });

    clearCsrf();

    await refreshCsrf();

    return getCurrentUser();
}

export async function getCurrentUser(): Promise<User> {

    return apiRequest<User>('/api/auth/me');
}

export async function logout(): Promise<void> {

    await apiRequest<void>('/api/auth/logout', {
        method: 'POST'
    });

    clearCsrf();
}