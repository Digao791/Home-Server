import { useState } from 'react';

import { Outlet } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { UploadProvider } from '../contexts/UploadProvider';
import { UploadPanel } from '../components/UploadPanel';
import '../styles/layout.css';

export function MainLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <UploadProvider>
        <div className="main-layout">

            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <button
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                />
            )}

            <div className="main-content">

                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>
            
        </div>
            <UploadPanel />
        </UploadProvider>
    );
}