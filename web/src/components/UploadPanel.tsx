import { useState } from 'react';

import {
    Upload,
    ChevronUp,
    ChevronDown,
    X,
    CheckCircle2,
    AlertCircle,
    FileText
} from 'lucide-react';

import { useUpload } from '../hooks/useUpload';

import '../styles/upload.css';

export function UploadPanel() {

    const {
        uploads,
        cancel,
        clearFinished
    } = useUpload();

    const [expanded, setExpanded] = useState(true);

    const activeCount = uploads.filter(upload =>
        upload.status === 'queued' ||
        upload.status === 'uploading' ||
        upload.status === 'processing'
    ).length;

    const hasFinished = uploads.some(upload =>
        upload.status === 'completed' ||
        upload.status === 'failed' ||
        upload.status === 'cancelled'
    );

    if (uploads.length === 0) return null;

    return (
        <aside
            className="upload-panel"
            aria-label="File transfers"
        >

            <button
                className="upload-panel-header"
                onClick={() => setExpanded(value => !value)}
                aria-expanded={expanded}
            >

                <Upload size={20} />

                <strong>Transfers</strong>

                <span className="upload-active-count">
                    {activeCount} active
                </span>

                {expanded
                    ? <ChevronDown size={18} />
                    : <ChevronUp size={18} />
                }

            </button>

            {expanded && (

                <>

                    <div className="upload-panel-list">

                        {uploads.map(upload => {

                            const cancellable =
                                upload.status === 'queued' ||
                                upload.status === 'uploading' ||
                                upload.status === 'processing';

                            return (
                                <article
                                    key={upload.id}
                                    className="upload-task"
                                >

                                    <div className="upload-task-header">

                                        <FileText size={20} />

                                        <div className="upload-task-info">

                                            <strong>
                                                {upload.name}
                                            </strong>

                                            <span>
                                                {upload.path || 'Storage'}
                                            </span>

                                        </div>

                                        {cancellable && (

                                            <button
                                                className="icon-button"
                                                onClick={() => cancel(upload.id)}
                                                aria-label={`Cancel ${upload.name}`}
                                            >
                                                <X size={18} />
                                            </button>

                                        )}

                                        {upload.status === 'completed' && (

                                            <CheckCircle2
                                                size={20}
                                                className="upload-success"
                                            />

                                        )}

                                        {upload.status === 'failed' && (

                                            <AlertCircle
                                                size={20}
                                                className="upload-failed"
                                            />

                                        )}

                                    </div>

                                    <div
                                        className="upload-progress"
                                        role="progressbar"
                                        aria-label={`Upload ${upload.name}`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={upload.progress}
                                    >

                                        <div
                                            className={`upload-progress-bar ${upload.status}`}
                                            style={{
                                                width: `${upload.progress}%`
                                            }}
                                        />

                                    </div>

                                    <div className="upload-task-status">

                                        <span>
                                            {upload.status}
                                        </span>

                                        <span>
                                            {upload.progress}%
                                        </span>

                                    </div>

                                    {upload.error && (

                                        <p className="upload-error">
                                            {upload.error}
                                        </p>

                                    )}

                                </article>
                            );
                        })}

                    </div>

                    {hasFinished && (

                        <div className="upload-panel-footer">

                            <button
                                className="secondary-button"
                                onClick={clearFinished}
                            >
                                Clear finished
                            </button>

                        </div>

                    )}

                </>

            )}

        </aside>
    );
}