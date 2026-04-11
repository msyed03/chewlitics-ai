import React from 'react';
import { theme } from '../../constants/theme';

const AppCard = ({ children, className = '', ...props }) => {
    const style = {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.card,
        ...props.style,
    };

    return (
        <div style={style} className={className} {...props}>
            {children}
        </div>
    );
};

export default AppCard;