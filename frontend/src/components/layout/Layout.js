import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { theme } from '../../constants/theme';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const mainStyle = {
        marginLeft: '260px',
        marginTop: '72px',
        backgroundColor: theme.colors.background,
        minHeight: 'calc(100vh - 72px)',
        '@media (max-width: 1024px)': {
            marginLeft: 0,
        },
    };

    const overlayStyle = {
        display: sidebarOpen ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
        '@media (min-width: 1024px)': {
            display: 'none',
        },
    };

    return (
        <>
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />
            <main style={mainStyle}>
                {children}
            </main>
        </>
    );
};

export default Layout;