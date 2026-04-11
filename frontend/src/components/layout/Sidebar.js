import React from 'react';
import SidebarNavItem from '../ui/SidebarNavItem';
import { sidebarNavItems } from '../../constants/routes';
import { theme } from '../../constants/theme';

const Sidebar = ({ isOpen, onClose, isDesktop }) => {
    const sidebarStyle = {
        width: theme.shell.sidebarWidth,
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        position: 'fixed',
        top: theme.shell.headerHeight,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 220ms ease',
        overflowY: 'auto',
        padding: theme.spacing.lg,
    };

    const navStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
    };

    return (
        <aside style={sidebarStyle} aria-hidden={!isOpen && !isDesktop}>
            <nav style={navStyle} aria-label="Primary">
                {sidebarNavItems.map((item) => (
                    <SidebarNavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        icon={item.icon}
                        end={item.end}
                        onClick={onClose}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
