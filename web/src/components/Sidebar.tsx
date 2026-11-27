import {
    Server,
    LayoutDashboard,
    Layers,
    Folder,
    Image,
    Video,
    Settings,
    LogOut,
    UserCircle,
    X
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Applications', path: '/applications', icon: Layers },
    { name: 'Files', path: '/files', icon: Folder },
    { name: 'Photos', path: '/photos', icon: Image },
    { name: 'Videos', path: '/videos', icon: Video },
    { name: 'Settings', path: '/settings', icon: Settings }
];

export function Sidebar({ open, onClose }: SidebarProps) {

    const { user, logout } = useAuth();

    async function handleLogout() {

        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>

            <div className="sidebar-brand">

                <Server size={26} />

                <span>HOME-LAB</span>

                <button
                    className="sidebar-close"
                    onClick={onClose}
                    aria-label="Close navigation"
                >
                    <X size={22} />
                </button>

            </div>

            <nav className="sidebar-navigation">

                <span className="navigation-label">
                    WORKSPACE
                </span>

                {navigation.map(item => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `navigation-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <Icon size={20} />

                            <span>{item.name}</span>

                        </NavLink>
                    );
                })}

            </nav>

            <div className="sidebar-footer">

                <div className="sidebar-user">

                    <UserCircle size={32} />

                    <div>
                        <strong>{user?.username}</strong>
                        <small>Home-Lab user</small>
                    </div>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Sign out
                </button>

            </div>

        </aside>
    );
}