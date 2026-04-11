import React, { useState, useEffect } from 'react';
import { theme } from '../../constants/theme';

const Header = ({ onMenuClick }) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const headerStyle = {
        height: '72px',
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: `0 ${theme.spacing.xl}`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        gap: theme.spacing.md,
    };

    const logoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        flex: 1,
    };

    const logoSquareStyle = {
        width: '40px',
        height: '40px',
        borderRadius: theme.borderRadius.md,
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        fontWeight: 700,
    };

    const titleStyle = {
        fontSize: '20px',
        fontWeight: 700,
        color: theme.colors.textPrimary,
        margin: 0,
    };

    const menuButtonStyle = {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: theme.colors.textSecondary,
        padding: theme.spacing.md,
        marginRight: theme.spacing.md,
        display: isDesktop ? 'none' : 'block',
        transition: 'color 200ms ease',
    };

    return (
        <header style={headerStyle}>
            <button style={menuButtonStyle} onClick={onMenuClick}>
                ☰
            </button>
            <div style={logoStyle}>
                <div style={logoSquareStyle}>C</div>
                <h1 style={titleStyle}>Chewlitics AI</h1>
            </div>
        </header>
    );
};

export default Header;