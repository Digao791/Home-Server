import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    percentage?: number;
}

export function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    percentage
}: MetricCardProps) {

    const progress = percentage === undefined
        ? undefined
        : Math.max(0, Math.min(100, percentage));

    return (
        <article className="metric-card">

            <div className="metric-heading">

                <Icon size={22} />

                <span>{title}</span>

            </div>

            <strong className="metric-value">
                {value}
            </strong>

            {progress !== undefined && (
                <div
                    className="metric-progress"
                    role="progressbar"
                    aria-label={title}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                >
                    <div
                        className="metric-progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <span className="metric-description">
                {description}
            </span>

        </article>
    );
}