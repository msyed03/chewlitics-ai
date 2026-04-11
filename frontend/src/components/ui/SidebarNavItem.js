import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarNavItem = ({
    icon: Icon,
    label,
    to,
    end = false,
    onClick,
}) => (
    <NavLink
        to={to}
        end={end}
        onClick={onClick}
        className={({ isActive }) =>
            `sidebar-nav-item${isActive ? ' sidebar-nav-item-active' : ''}`
        }
    >
        {Icon && <Icon size={18} />}
        <span>{label}</span>
    </NavLink>
);

export default SidebarNavItem;
