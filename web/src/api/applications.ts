import { apiRequest } from './client';

import type {
    Application,
    ApplicationRequest
} from '../types/application';

const BASE_URL = '/api/applications';

export function getApplications(): Promise<Application[]> {

    return apiRequest<Application[]>(BASE_URL);
}

export function getApplication(id: number): Promise<Application> {

    return apiRequest<Application>(`${BASE_URL}/${id}`);
}

export function createApplication(
    request: ApplicationRequest
): Promise<Application> {

    return apiRequest<Application>(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(request)
    });
}

export function updateApplication(
    id: number,
    request: ApplicationRequest
): Promise<Application> {

    return apiRequest<Application>(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });
}

export function deleteApplication(id: number): Promise<void> {

    return apiRequest<void>(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
}