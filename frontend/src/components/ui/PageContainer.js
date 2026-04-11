import React from 'react';
import { theme } from '../../constants/theme';

const PageContainer = ({ children, className = '', ...props }) => {
    const style = {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: theme.spacing.xxl,
        '@media (max-width: 768px)': {
            padding: theme.spacing.lg,
        },
        ...props.style,
    };

    return (
        <div style={style} className={className} {...props}>
            {children}
        </div>
    );
};

export default PageContainer;