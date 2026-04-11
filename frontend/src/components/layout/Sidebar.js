import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdRestaurant, MdTrackChanges, MdInsights } from 'react-icons/md';
import SidebarNavItem from '../ui/SidebarNavItem';
import { theme } from '../../constants/theme';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: MdDashboard },
    { path: '/log-meal', label: 'Log Meal', icon: MdRestaurant },
    { path: '/habits', label: 'Habits', icon: MdTrackChanges },
    { path: '/insights', label: 'Insights', icon: MdInsights },
  ];

  const sidebarStyle = {
    width: '260px',
    height: '100vh',
    backgroundColor: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    display: isOpen ? 'block' : 'none',
    '@media (max-width: 1024px)': {
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 300ms ease',
    },
  };

  const navStyle = {
    padding: theme.spacing.xl,
    paddingTop: '88px', // Account for header
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