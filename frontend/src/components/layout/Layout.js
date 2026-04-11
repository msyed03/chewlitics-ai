import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { theme } from '../../constants/theme';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mainStyle = {
        marginLeft: isDesktop ? '260px' : 0,
        marginTop: '72px',
        backgroundColor: theme.colors.background,
        minHeight: 'calc(100vh - 72px)',
        transition: 'margin-left 300ms ease',
    };

    const overlayStyle = {
        display: sidebarOpen && !isDesktop ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
        opacity: sidebarOpen ? 1 : 0,
        transition: 'opacity 300ms ease',
        pointerEvents: sidebarOpen ? 'auto' : 'none',
    };

    return (
        <>
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={isDesktop ? true : sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />
            <main style={mainStyle}>
                {children}
            </main>
        </>
    );
};

export default Layout;