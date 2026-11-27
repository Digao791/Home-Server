export interface User {
    id: number;
    username: string;
    enabled: boolean;
    createdAt: string;
}

export interface LoginRequest{
    username: string;
    password: string;
}

export interface CsrfToken {
    token: string;
    headerName: string;
    parameterName: string;
}

