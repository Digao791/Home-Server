import { apiRequest } from './client';

import type {
    FileEntry,
    CreateDirectoryRequest,
    RenameFileRequest,
    MoveFileRequest
} from '../types/file';

const BASE_URL = '/api/files';

export function getFiles(path: string): Promise<FileEntry[]> {

    const params = new URLSearchParams({ path });

    return apiRequest<FileEntry[]>(
        `${BASE_URL}?${params}`
    );
}

export function createDirectory(
    request: CreateDirectoryRequest
): Promise<FileEntry> {

    return apiRequest<FileEntry>(`${BASE_URL}/directory`, {
        method: 'POST',
        body: JSON.stringify(request)
    });
}

export function uploadFile(
    path: string,
    file: File
): Promise<FileEntry> {

    const body = new FormData();

    body.append('path', path);
    body.append('file', file);

    return apiRequest<FileEntry>(`${BASE_URL}/upload`, {
        method: 'POST',
        body
    });
}

export function getDownloadUrl(path: string): string {

    const params = new URLSearchParams({ path });

    return `${BASE_URL}/download?${params}`;
}

export function renameFile(
    request: RenameFileRequest
): Promise<FileEntry> {

    return apiRequest<FileEntry>(`${BASE_URL}/rename`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });
}

export function moveFile(
    request: MoveFileRequest
): Promise<FileEntry> {

    return apiRequest<FileEntry>(`${BASE_URL}/move`, {
        method: 'PATCH',
        body: JSON.stringify(request)
    });
}

export function deleteFile(path: string): Promise<void> {

    const params = new URLSearchParams({ path });

    return apiRequest<void>(`${BASE_URL}?${params}`, {
        method: 'DELETE'
    });
}