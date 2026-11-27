import { apiRequest } from './client';

import type { SystemInfo } from '../types/system';

export function getSystemInfo(): Promise<SystemInfo> {

    return apiRequest<SystemInfo>('/api/system/info');
}