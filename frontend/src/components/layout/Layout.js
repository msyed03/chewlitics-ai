import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { theme } from '../../constants/theme';

const DESKTOP_BREAKPOINT = 1024;

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
            setIsDesktop(desktop);
            if (desktop) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mainStyle = {
        marginLeft: isDesktop ? theme.shell.sidebarWidth : 0,
        marginTop: theme.shell.headerHeight,
        backgroundColor: theme.colors.background,
        minHeight: `calc(100vh - ${theme.shell.headerHeight})`,
        transition: 'margin-left 220ms ease',
    };

    const overlayStyle = {
        display: sidebarOpen && !isDesktop ? 'block' : 'none',
        position: 'fixed',
        top: theme.shell.headerHeight,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.24)',
        zIndex: 999,
    };

    return (
        <>
            <Header
                onMenuClick={() => setSidebarOpen((open) => !open)}
                isDesktop={isDesktop}
            />
            <Sidebar
                isOpen={isDesktop ? true : sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isDesktop={isDesktop}
            />
            <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />
            <main style={mainStyle}>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
