import React from 'react';
import { theme } from '../../constants/theme';

const SectionHeader = ({ title, subtitle, className = '', ...props }) => {
    const style = {
        marginBottom: theme.spacing.xl,
        ...props.style,
    };

    const titleStyle = {
        ...theme.typography.sectionHeading,
        color: theme.colors.textPrimary,
        margin: 0,
        marginBottom: subtitle ? theme.spacing.sm : 0,
    };

    const subtitleStyle = {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        margin: 0,
    };

    return (
        <div style={style} className={className} {...props}>
            <h2 style={titleStyle}>{title}</h2>
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;