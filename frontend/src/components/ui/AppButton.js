import React from 'react';
import { theme } from '../../constants/theme';

const variantStyles = {
    primary: {
        backgroundColor: theme.colors.primary,
        color: '#FFFFFF',
        border: '1px solid transparent',
        boxShadow: theme.shadows.button,
    },
    secondary: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.textPrimary,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 'none',
    },
    ghost: {
        backgroundColor: 'transparent',
        color: theme.colors.textPrimary,
        border: `1px solid transparent`,
        boxShadow: 'none',
    },
};

const AppButton = ({
    children,
    variant = 'primary',
    onClick,
    disabled = false,
    className = '',
    style,
    type = 'button',
    ...props
}) => {
    const computedStyle = {
        minHeight: '40px',
        borderRadius: theme.borderRadius.md,
        fontSize: theme.typography.body.fontSize,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        padding: '0 16px',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
        ...variantStyles[variant],
        ...style,
    };

    return (
        <button
            type={type}
            style={computedStyle}
            onClick={onClick}
            disabled={disabled}
            className={`app-button app-button-${variant} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
};

export default AppButton;
