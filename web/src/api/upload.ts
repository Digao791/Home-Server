import { ApiError, getCsrfToken } from './client';

import type { FileEntry } from '../types/file';

interface UploadOptions {
    path: string;
    file: File;
    signal: AbortSignal;
    onProgress: (progress: number) => void;
    onProcessing: () => void;
}

export async function uploadWithProgress({
    path,
    file,
    signal,
    onProgress,
    onProcessing
}: UploadOptions): Promise<FileEntry> {

    const csrf = await getCsrfToken();

    signal.throwIfAborted();

    return new Promise<FileEntry>((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        const body = new FormData();

        body.append('path', path);
        body.append('file', file);

        function abort() {
            xhr.abort();
        }

        xhr.open('POST', '/api/files/upload');

        xhr.setRequestHeader(
            csrf.headerName,
            csrf.token
        );

        xhr.upload.onprogress = event => {

            if (!event.lengthComputable) return;

            const progress = Math.round(
                event.loaded / event.total * 100
            );

            onProgress(progress);
        };

        xhr.upload.onload = () => {

            onProgress(100);
            onProcessing();
        };

        xhr.onload = () => {

            if (xhr.status >= 200 && xhr.status < 300) {

                try {

                    const response: FileEntry =
                        JSON.parse(xhr.responseText);

                    resolve(response);

                } catch {

                    reject(new Error('Invalid server response'));
                }

            } else {

                reject(
                    new ApiError(
                        xhr.status,
                        `Upload failed: ${xhr.status}`
                    )
                );
            }
        };

        xhr.onerror = () => {

            reject(new Error('Network error'));
        };

        xhr.onabort = () => {

            reject(
                new DOMException(
                    'Upload cancelled',
                    'AbortError'
                )
            );
        };

        xhr.onloadend = () => {

            signal.removeEventListener('abort', abort);
        };

        signal.addEventListener(
            'abort',
            abort,
            { once: true }
        );

        xhr.send(body);
    });
}