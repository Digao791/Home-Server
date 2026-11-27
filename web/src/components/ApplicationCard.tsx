import {
    Server,
    Wallet,
    Radar,
    Database,
    Code,
    ExternalLink,
    Pencil,
    Trash2
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import type { Application } from '../types/application';

interface ApplicationCardProps {
    application: Application;
    onEdit?: (application: Application) => void;
    onDelete?: (application: Application) => void;
}

const icons: Record<string, LucideIcon> = {
    server: Server,
    wallet: Wallet,
    radar: Radar,
    database: Database,
    code: Code
};

function getSafeUrl(value: string): string | null {

    try {
        const url = new URL(value);

        return ['http:', 'https:'].includes(url.protocol)
            ? url.href
            : null;

    } catch {
        return null;
    }
}

export function ApplicationCard({
    application,
    onEdit,
    onDelete
}: ApplicationCardProps) {

    const Icon = icons[application.icon ?? 'server'] ?? Server;

    const safeUrl = getSafeUrl(application.url);

    return (
        <article className="application-card">

            <div className="application-card-header">

                <div className="application-icon">
                    <Icon size={26} />
                </div>

                <span className={
                    application.enabled
                        ? 'application-status enabled'
                        : 'application-status disabled'
                }>
                    {application.enabled ? 'Enabled' : 'Disabled'}
                </span>

            </div>

            <h3>{application.name}</h3>

            <p className="application-description">
                {application.description || 'No description'}
            </p>

            <span className="application-url">
                {application.url}
            </span>

            <div className="application-card-footer">

                {application.enabled && safeUrl ? (
                    <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="application-link"
                    >
                        Open application
                        <ExternalLink size={14} />
                    </a>
                ) : (
                    <span className="application-url">
                        Unavailable
                    </span>
                )}

                <div className="application-actions">

                    {onEdit && (
                        <button
                            className="icon-button"
                            aria-label={`Edit ${application.name}`}
                            onClick={() => onEdit(application)}
                        >
                            <Pencil size={18} />
                        </button>
                    )}

                    {onDelete && (
                        <button
                            className="icon-button danger"
                            aria-label={`Delete ${application.name}`}
                            onClick={() => onDelete(application)}
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                </div>

            </div>

        </article>
    );
}