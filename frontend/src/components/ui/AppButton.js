import React from 'react';
import { theme } from '../../constants/theme';

const AppButton = ({
    children,
    variant = 'primary',
    onClick,
    disabled = false,
    className = '',
    ...props
}) => {
    const baseStyles = {
        height: '48px',
        borderRadius: theme.borderRadius.lg,
        fontSize: theme.typography.body.fontSize,
        fontWeight: 600,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 200ms ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        opacity: disabled ? 0.6 : 1,
    };

    const variants = {
        primary: {
            backgroundColor: theme.colors.primary,
            color: 'white',
            boxShadow: theme.shadows.button,
            '&:hover': {
                backgroundColor: theme.colors.primaryHover,
            },
        },
        secondary: {
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            border: `1px solid ${theme.colors.border}`,
            '&:hover': {
                backgroundColor: '#F3F4F6',
            },
        },
    };

    const style = {
        ...baseStyles,
        ...variants[variant],
    };

    return (
        <button
            style={style}
            onClick={onClick}
            disabled={disabled}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};

export default AppButton;