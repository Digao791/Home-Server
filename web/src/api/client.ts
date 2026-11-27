import type { CsrfToken } from '../types/auth';

let csrfToken: CsrfToken | null = null;

export class ApiError extends Error {

    readonly status: number;

    constructor(status: number, message: string) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
    }
}

export async function refreshCsrf(): Promise<CsrfToken> {

    const response = await fetch('/api/auth/csrf', {
        credentials: 'same-origin',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new ApiError(
            response.status,
            'Could not obtain CSRF token'
        );
    }

    const token: CsrfToken = await response.json();

    csrfToken = token;

    return token;
}

export function clearCsrf(): void {
    csrfToken = null;
}

export async function getCsrfToken(): Promise<CsrfToken> {

    return csrfToken ?? await refreshCsrf();
}

export async function apiRequest<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {

    const method = (options.method ?? 'GET').toUpperCase();

    const headers = new Headers(options.headers);

    const requiresCsrf = ![
        'GET',
        'HEAD',
        'OPTIONS',
        'TRACE'
    ].includes(method);

    if (requiresCsrf) {

        const csrf = await getCsrfToken();

        headers.set(csrf.headerName, csrf.token);
    }

    if (
        typeof options.body === 'string' &&
        !headers.has('Content-Type')
    ) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
        ...options,
        method,
        headers,
        credentials: 'same-origin'
    });

    if (!response.ok) {

        throw new ApiError(
            response.status,
            `Request failed: ${response.status}`
        );
    }

    if (
        response.status === 204 ||
        response.headers.get('Content-Length') === '0'
    ) {
        return undefined as T;
    }

    const contentType =
        response.headers.get('Content-Type') ?? '';

    if (contentType.includes('application/json')) {
        return await response.json() as T;
    }

    return undefined as T;
}