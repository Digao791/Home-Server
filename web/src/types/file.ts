export type FileType = 'FILE' | 'DIRECTORY';

export interface FileEntry {
    name: string;
    path: string;
    type: FileType;
    size: number | null;
    lastModified: string;
}

export interface CreateDirectoryRequest {
    path: string;
    name: string;
}

export interface RenameFileRequest {
    path: string;
    newName: string;
}

export interface MoveFileRequest {
    path: string;
    destinationPath: string;
}