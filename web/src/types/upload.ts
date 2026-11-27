export type UploadStatus =
    | 'queued'
    | 'uploading'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled';

export interface UploadTask {
    id: string;
    name: string;
    path: string;
    size: number;
    progress: number;
    status: UploadStatus;
    error?: string;
}