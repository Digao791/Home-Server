import {
    useState,
    useRef,
    useEffect
} from 'react';

import type { ReactNode } from 'react';

import { useSWRConfig } from 'swr';

import { UploadContext } from './UploadContext';

import { uploadWithProgress } from '../api/upload';

import { ApiError } from '../api/client';

import type { UploadTask } from '../types/upload';

interface QueuedUpload {
    id: string;
    path: string;
    file: File;
}

interface ActiveUpload {
    id: string;
    controller: AbortController;
}

interface UploadProviderProps {
    children: ReactNode;
}

export function UploadProvider({
    children
}: UploadProviderProps) {

    const [uploads, setUploads] =
        useState<UploadTask[]>([]);

    const queue = useRef<QueuedUpload[]>([]);

    const active = useRef<ActiveUpload | null>(null);

    const running = useRef(false);

    const disposed = useRef(false);

    const { mutate } = useSWRConfig();

    useEffect(() => {

        disposed.current = false;

        return () => {

            disposed.current = true;

            queue.current = [];

            active.current?.controller.abort();
        };

    }, []);

    function updateTask(
        id: string,
        changes: Partial<UploadTask>
    ) {

        if (disposed.current) return;

        setUploads(previous =>
            previous.map(upload =>
                upload.id === id
                    ? { ...upload, ...changes }
                    : upload
            )
        );
    }

    async function processQueue() {

        if (running.current || disposed.current) return;

        running.current = true;

        try {

            while (
                queue.current.length > 0 &&
                !disposed.current
            ) {

                const task = queue.current.shift();

                if (!task) break;

                const controller = new AbortController();

                active.current = {
                    id: task.id,
                    controller
                };

                updateTask(task.id, {
                    status: 'uploading'
                });

                try {

                    await uploadWithProgress({

                        path: task.path,

                        file: task.file,

                        signal: controller.signal,

                        onProgress: progress => {

                            updateTask(task.id, {
                                progress
                            });
                        },

                        onProcessing: () => {

                            updateTask(task.id, {
                                status: 'processing'
                            });
                        }
                    });

                    updateTask(task.id, {
                        status: 'completed',
                        progress: 100
                    });

                } catch (exception) {

                    if (controller.signal.aborted) {

                        updateTask(task.id, {
                            status: 'cancelled'
                        });

                    } else {

                        updateTask(task.id, {
                            status: 'failed',
                            error: getErrorMessage(exception)
                        });
                    }

                } finally {

                    active.current = null;

                    if (!disposed.current) {

                        void mutate(
                            ['/api/files', task.path]
                        ).catch(console.error);
                    }
                }
            }

        } finally {

            running.current = false;
        }
    }

    function enqueue(path: string, files: File[]) {

        if (disposed.current || files.length === 0) {
            return;
        }

        const tasks = files.map(file => ({
            id: crypto.randomUUID(),
            path,
            file
        }));

        const newUploads: UploadTask[] =
            tasks.map(task => ({
                id: task.id,
                name: task.file.name,
                path: task.path,
                size: task.file.size,
                progress: 0,
                status: 'queued'
            }));

        queue.current.push(...tasks);

        setUploads(previous => [
            ...previous,
            ...newUploads
        ]);

        void processQueue();
    }

    function cancel(id: string) {

        if (active.current?.id === id) {

            active.current.controller.abort();

            return;
        }

        const queued = queue.current.some(
            task => task.id === id
        );

        if (queued) {

            queue.current = queue.current.filter(
                task => task.id !== id
            );

            updateTask(id, {
                status: 'cancelled'
            });
        }
    }

    function clearFinished() {

        setUploads(previous =>
            previous.filter(upload =>
                upload.status === 'queued' ||
                upload.status === 'uploading' ||
                upload.status === 'processing'
            )
        );
    }

    return (
        <UploadContext.Provider
            value={{
                uploads,
                enqueue,
                cancel,
                clearFinished
            }}
        >
            {children}
        </UploadContext.Provider>
    );
}

function getErrorMessage(exception: unknown): string {

    if (exception instanceof ApiError) {

        switch (exception.status) {

            case 401:
                return 'Session expired.';

            case 403:
                return 'Upload not permitted.';

            case 409:
                return 'A file with this name already exists.';

            case 413:
                return 'File exceeds the upload size limit.';

            default:
                return `Upload failed (${exception.status}).`;
        }
    }

    return exception instanceof Error
        ? exception.message
        : 'Unknown upload error.';
}