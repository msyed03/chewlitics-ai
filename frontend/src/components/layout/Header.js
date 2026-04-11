import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import AppButton from '../ui/AppButton';
import { headerNavItems, routePaths } from '../../constants/routes';
import { theme } from '../../constants/theme';

const Header = ({ onMenuClick, isDesktop }) => {
    const headerStyle = {
        height: theme.shell.headerHeight,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${theme.spacing.xl}`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        backdropFilter: 'blur(14px)',
        gap: theme.spacing.lg,
    };

    const brandStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        color: theme.colors.textPrimary,
        textDecoration: 'none',
        flexShrink: 0,
    };

    const logoSquareStyle = {
        width: '36px',
        height: '36px',
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        boxShadow: theme.shadows.button,
    };

    const logoImageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    };

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 700,
        color: theme.colors.textPrimary,
        margin: 0,
        whiteSpace: 'nowrap',
    };

    const menuButtonStyle = {
        display: isDesktop ? 'none' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        padding: 0,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        color: theme.colors.textPrimary,
        cursor: 'pointer',
        flexShrink: 0,
    };

    const centerNavStyle = {
        display: isDesktop ? 'flex' : 'none',
        alignItems: 'center',
        gap: theme.spacing.sm,
        flex: 1,
        minWidth: 0,
    };

    const authStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        flexShrink: 0,
    };

    return (
        <header style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, minWidth: 0 }}>
                <button
                    type="button"
                    style={menuButtonStyle}
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    <MdMenu size={22} />
                </button>
                <NavLink to={routePaths.dashboard} style={brandStyle}>
                    <div style={logoSquareStyle}>
                        <img src="/logo192.png" alt="Chewlitics AI logo" style={logoImageStyle} />
                    </div>
                    <h1 style={titleStyle}>Chewlitics AI</h1>
                </NavLink>
            </div>

            <nav style={centerNavStyle} aria-label="Secondary">
                {headerNavItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `top-nav-link${isActive ? ' top-nav-link-active' : ''}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={authStyle}>
                <AppButton variant="ghost">Login</AppButton>
                <AppButton>Sign Up</AppButton>
            </div>
        </header>
    );
};

export default Header;
