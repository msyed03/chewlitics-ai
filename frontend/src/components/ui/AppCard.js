import React from 'react';
import { theme } from '../../constants/theme';

const AppCard = ({ children, className = '', style, ...props }) => {
    const cardStyle = {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.card,
        ...style,
    };

    return (
        <div style={cardStyle} className={className} {...props}>
            {children}
        </div>
    );
};

export default AppCard;
