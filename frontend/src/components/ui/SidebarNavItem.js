import React from 'react';
import { theme } from '../../constants/theme';

const SidebarNavItem = ({
    icon: Icon,
    label,
    isActive = false,
    onClick,
    className = '',
    ...props
}) => {
    const baseStyles = {
        height: '48px',
        borderRadius: theme.borderRadius.lg,
        padding: '0 16px',
        fontSize: '15px',
        fontWeight: isActive ? 600 : 500,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        border: 'none',
        backgroundColor: 'transparent',
        color: isActive ? theme.colors.primary : theme.colors.textSecondary,
        width: '100%',
        textAlign: 'left',
    };

    const hoverStyles = {
        backgroundColor: '#EEF2FF',
        color: theme.colors.primary,
    };

    const activeStyles = {
        backgroundColor: '#EEF2FF',
        color: theme.colors.primary,
        fontWeight: 600,
    };

    const style = {
        ...baseStyles,
        ...(isActive ? activeStyles : {}),
    };

    return (
        <button
            style={style}
            onClick={onClick}
            className={className}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.target.style.backgroundColor = hoverStyles.backgroundColor;
                    e.target.style.color = hoverStyles.color;
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.target.style.backgroundColor = baseStyles.backgroundColor;
                    e.target.style.color = baseStyles.color;
                }
            }}
            {...props}
        >
            {Icon && <Icon size={20} />}
            <span>{label}</span>
        </button>
    );
};

export default SidebarNavItem;