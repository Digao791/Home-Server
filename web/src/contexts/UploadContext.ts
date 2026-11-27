import { createContext } from 'react';

import type { UploadTask } from '../types/upload';

export interface UploadContextType {

    uploads: UploadTask[];

    enqueue: (
        path: string,
        files: File[]
    ) => void;

    cancel: (id: string) => void;

    clearFinished: () => void;
}

export const UploadContext =
    createContext<UploadContextType | undefined>(
        undefined
    );