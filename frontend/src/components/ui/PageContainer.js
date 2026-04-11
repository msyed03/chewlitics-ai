import React from 'react';
import { theme } from '../../constants/theme';

const PageContainer = ({ children, className = '', style, ...props }) => {
    const containerStyle = {
        maxWidth: theme.shell.contentMaxWidth,
        margin: '0 auto',
        padding: theme.spacing.xl,
        ...style,
    };

    return (
        <div style={containerStyle} className={className} {...props}>
            {children}
        </div>
    );
};

export default PageContainer;
