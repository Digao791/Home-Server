import { Menu, Server } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {

    return (
        <header className="main-header">

            <button
                className="menu-button"
                onClick={onMenuClick}
                aria-label="Open navigation"
            >
                <Menu size={24} />
            </button>

            <div className="header-brand">
                <Server size={20} />
                <span>Home-Lab System</span>
            </div>

        </header>
    );
}