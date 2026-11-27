export interface ApplicationRequest {
    name: string;
    description: string | null;
    url: string;
    healthCheckUrl: string | null;
    icon: string | null;
    enabled: boolean;
}

export interface Application extends ApplicationRequest{
    id: number;
    createdAt: string;
    updatedAt: string;
}