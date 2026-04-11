import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdCamera, MdHistory, MdTrendingUp, MdEmojiEvents, MdSchool, MdRestaurant, MdShoppingCart, MdPerson } from 'react-icons/md';
import SidebarNavItem from '../ui/SidebarNavItem';
import { theme } from '../../constants/theme';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: MdDashboard },
        { path: '/meal-scanner', label: 'Meal Scanner', icon: MdCamera },
        { path: '/meal-history', label: 'Meal History', icon: MdHistory },
        { path: '/nutrition-analytics', label: 'Nutrition Analytics', icon: MdTrendingUp },
        { path: '/habit-insights', label: 'Habit Insights', icon: MdEmojiEvents },
        { path: '/ai-coach', label: 'AI Coach', icon: MdSchool },
        { path: '/recipe-generator', label: 'Recipe Generator', icon: MdRestaurant },
        { path: '/grocery-planner', label: 'Grocery Planner', icon: MdShoppingCart },
        { path: '/profile', label: 'Profile & Goals', icon: MdPerson },
    ];

    // Desktop sidebar is always visible, mobile sidebar slides in
    const sidebarStyle = {
        width: '260px',
        height: '100vh',
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 300ms ease',
        overflowY: 'auto',
    };

    const navStyle = {
        padding: theme.spacing.lg,
        paddingTop: '88px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
    };

    return (
        <div style={sidebarStyle}>
            <nav style={navStyle}>
                {navItems.map((item) => (
                    <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }} onClick={onClose}>
                        <SidebarNavItem
                            icon={item.icon}
                            label={item.label}
                            isActive={location.pathname === item.path}
                        />
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;