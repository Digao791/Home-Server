import { useState, useRef } from 'react';

import type { ChangeEvent } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useSWRConfig } from 'swr';

import {
    Upload,
    FolderPlus,
    FolderOpen,
    List,
    Grid2X2,
    Search
} from 'lucide-react';

import { useFiles } from '../hooks/useFiles';

import {
    createDirectory,
    renameFile,
    moveFile,
    deleteFile
} from '../api/files';

import { ApiError } from '../api/client';

import { FileBreadcrumb } from '../components/FileBreadcrumb';
import { FileList } from '../components/FileList';
import { FileActionDialog } from '../components/FileActionDialog';
import { useUpload } from '../hooks/useUpload';
import type { FileEntry } from '../types/file';

import '../styles/applications.css';
import '../styles/files.css';

type FileAction =
    | { type: 'create' }
    | { type: 'rename'; file: FileEntry }
    | { type: 'move'; file: FileEntry };

export function FilesPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const path = searchParams.get('path') ?? '';

    const { data, error, isLoading, mutate } = useFiles(path);

    const { mutate: globalMutate } = useSWRConfig();

    const [view, setView] = useState<'list' | 'grid'>('list');

    const [search, setSearch] = useState('');

    const [action, setAction] = useState<FileAction | null>(null);

    const [actionError, setActionError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { enqueue } = useUpload();

    function navigateTo(directory: string) {

        setSearch('');
        setAction(null);
        setActionError('');

        setSearchParams(
            directory ? { path: directory } : {}
        );
    }

    function handleOpen(file: FileEntry) {

        if (file.type === 'DIRECTORY') {
            navigateTo(file.path);
        }
    }

    async function handleAction(value: string) {

            if (!action) return;

            switch (action.type) {

                case 'create':

                    await createDirectory({
                        path,
                        name: value
                    });

                    break;

                case 'rename':

                    await renameFile({
                        path: action.file.path,
                        newName: value
                    });

                    break;

                case 'move':

                    await moveFile({
                        path: action.file.path,
                        destinationPath: value
                    });

                    await globalMutate(['/api/files', value]);

                    break;
            }

            setAction(null);

            await mutate();
        }

        function handleUpload(
        event: ChangeEvent<HTMLInputElement>
    ) {

        const files = Array.from(
            event.target.files ?? []
        );

        event.target.value = '';

        if (files.length === 0) return;

        enqueue(path, files);
    }

    async function handleDelete(file: FileEntry) {

        const confirmed = window.confirm(
            `Delete "${file.name}"? This cannot be undone.`
        );

        if (!confirmed) return;

        setActionError('');

        try {

            await deleteFile(file.path);

            await mutate();

        } catch (exception) {

            if (
                exception instanceof ApiError &&
                exception.status === 409
            ) {

                setActionError('The directory is not empty.');

            } else {

                setActionError('Could not delete entry.');
            }
        }
    }

    const filteredFiles = (data ?? []).filter(file =>
        file.name.toLowerCase().includes(
            search.toLowerCase()
        )
    );

    return (
        <div className="files-page">

            <div className="files-heading">

                <div>
                    <h1>Files</h1>
                    <p>Manage your personal storage.</p>
                </div>

                <div className="files-toolbar">

                    <button
                        className="primary-button"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={18} />
                        Upload
                    </button>

                    <button
                        className="secondary-button"
                        onClick={() => setAction({ type: 'create' })}
                    >
                        <FolderPlus size={18} />
                        New folder
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleUpload}
                    />

                </div>

            </div>

            <FileBreadcrumb
                path={path}
                onNavigate={navigateTo}
            />

            {actionError && (
                <p className="file-error" role="alert">
                    {actionError}
                </p>
            )}

            {action && (

                <FileActionDialog

                    key={
                        action.type === 'create'
                            ? 'create'
                            : `${action.type}:${action.file.path}`
                    }

                    title={
                        action.type === 'create'
                            ? 'New directory'
                            : action.type === 'rename'
                                ? 'Rename entry'
                                : 'Move entry'
                    }

                    label={
                        action.type === 'create'
                            ? 'Directory name'
                            : action.type === 'rename'
                                ? 'New name'
                                : 'Destination directory (empty for root)'
                    }

                    initialValue={
                        action.type === 'rename'
                            ? action.file.name
                            : ''
                    }

                    allowEmpty={action.type === 'move'}

                    onSubmit={handleAction}

                    onCancel={() => setAction(null)}

                />

            )}

            <div className="files-controls">

                <div className="file-search">

                    <Search size={18} />

                    <input
                        aria-label="Search files"
                        placeholder="Search files..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                </div>

                <div className="view-controls">

                    <button
                        className={`icon-button ${view === 'list' ? 'selected' : ''}`}
                        onClick={() => setView('list')}
                        aria-label="List view"
                        aria-pressed={view === 'list'}
                    >
                        <List size={20} />
                    </button>

                    <button
                        className={`icon-button ${view === 'grid' ? 'selected' : ''}`}
                        onClick={() => setView('grid')}
                        aria-label="Grid view"
                        aria-pressed={view === 'grid'}
                    >
                        <Grid2X2 size={20} />
                    </button>

                </div>

            </div>

            {isLoading && (
                <p>Loading files...</p>
            )}

            {error && (

                <div className="file-error">

                    Could not load directory.

                    <button
                        className="secondary-button"
                        onClick={() => void mutate()}
                    >
                        Try again
                    </button>

                </div>

            )}

            {!isLoading && !error && filteredFiles.length === 0 && (

                <div className="files-empty">

                    <FolderOpen size={48} />

                    <h2>
                        {search ? 'No matching files' : 'Empty directory'}
                    </h2>

                    <p>
                        {search
                            ? 'Try a different search.'
                            : 'Upload files or create a directory.'}
                    </p>

                </div>

            )}

            <FileList
                files={filteredFiles}
                view={view}
                onOpen={handleOpen}
                onRename={file => {
                    setAction({ type: 'rename', file });
                }}
                onMove={file => {
                    setAction({ type: 'move', file });
                }}
                onDelete={file => {
                    void handleDelete(file);
                }}
            />

            <p className="files-count">
                {filteredFiles.length} items
            </p>

        </div>
    );
}