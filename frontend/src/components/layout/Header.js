import React from 'react';
import { theme } from '../../constants/theme';

const Header = ({ onMenuClick }) => {
    const headerStyle = {
        height: '72px',
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${theme.spacing.xl}`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    };

    const logoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
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
        display: 'none',
        '@media (max-width: 1024px)': {
            display: 'block',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.colors.textSecondary,
        },
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