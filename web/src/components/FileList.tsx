import {
    Folder,
    FileText,
    Image,
    Video,
    Music,
    Download,
    Pencil,
    FolderInput,
    Trash2
} from 'lucide-react';

import type { FileEntry } from '../types/file';

import { getDownloadUrl } from '../api/files';

interface FileListProps {
    files: FileEntry[];
    view: 'list' | 'grid';
    onOpen: (file: FileEntry) => void;
    onRename: (file: FileEntry) => void;
    onMove: (file: FileEntry) => void;
    onDelete: (file: FileEntry) => void;
}

function getFileIcon(file: FileEntry) {

    if (file.type === 'DIRECTORY') {
        return Folder;
    }

    const extension = file.name
        .split('.')
        .pop()
        ?.toLowerCase() ?? '';

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
        return Image;
    }

    if (['mp4', 'mkv', 'avi', 'mov'].includes(extension)) {
        return Video;
    }

    if (['mp3', 'wav', 'flac'].includes(extension)) {
        return Music;
    }

    return FileText;
}

function formatSize(size: number | null): string {

    if (size === null) return '—';

    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];

    let value = size;
    let unit = 0;

    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit++;
    }

    return `${value.toFixed(1)} ${units[unit]}`;
}

function formatDate(value: string): string {

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString();
}

export function FileList({
    files,
    view,
    onOpen,
    onRename,
    onMove,
    onDelete
}: FileListProps) {

    return (
        <div className={`file-list file-list-${view}`}>

            {files.map(file => {

                const Icon = getFileIcon(file);

                return (
                    <article
                        key={file.path}
                        className="file-entry"
                    >

                        <div className="file-identity">

                            <Icon
                                size={28}
                                className="file-entry-icon"
                            />

                            {file.type === 'DIRECTORY' ? (

                                <button
                                    className="file-name"
                                    onClick={() => onOpen(file)}
                                >
                                    {file.name}
                                </button>

                            ) : (

                                <span className="file-name">
                                    {file.name}
                                </span>

                            )}

                        </div>

                        <span className="file-size">
                            {formatSize(file.size)}
                        </span>

                        <span className="file-date">
                            {formatDate(file.lastModified)}
                        </span>

                        <div className="file-actions">

                            {file.type === 'FILE' && (

                                <a
                                    className="icon-button"
                                    href={getDownloadUrl(file.path)}
                                    aria-label={`Download ${file.name}`}
                                    title="Download"
                                >
                                    <Download size={18} />
                                </a>

                            )}

                            <button
                                className="icon-button"
                                onClick={() => onRename(file)}
                                aria-label={`Rename ${file.name}`}
                                title="Rename"
                            >
                                <Pencil size={18} />
                            </button>

                            <button
                                className="icon-button"
                                onClick={() => onMove(file)}
                                aria-label={`Move ${file.name}`}
                                title="Move"
                            >
                                <FolderInput size={18} />
                            </button>

                            <button
                                className="icon-button danger"
                                onClick={() => onDelete(file)}
                                aria-label={`Delete ${file.name}`}
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>

                        </div>

                    </article>
                );
            })}

        </div>
    );
}