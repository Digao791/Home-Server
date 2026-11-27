import { HardDrive, ChevronRight } from 'lucide-react';

interface FileBreadcrumbProps {
    path: string;
    onNavigate: (path: string) => void;
}

export function FileBreadcrumb({
    path,
    onNavigate
}: FileBreadcrumbProps) {

    const segments = path.split('/').filter(Boolean);

    return (
        <nav
            className="file-breadcrumb"
            aria-label="Directory navigation"
        >

            <button onClick={() => onNavigate('')}>
                <HardDrive size={18} />
                Storage
            </button>

            {segments.map((segment, index) => {

                const targetPath = segments
                    .slice(0, index + 1)
                    .join('/');

                return (
                    <span
                        key={targetPath}
                        className="breadcrumb-segment"
                    >

                        <ChevronRight size={16} />

                        <button
                            onClick={() => onNavigate(targetPath)}
                            aria-current={
                                targetPath === path
                                    ? 'location'
                                    : undefined
                            }
                        >
                            {segment}
                        </button>

                    </span>
                );
            })}

        </nav>
    );
}