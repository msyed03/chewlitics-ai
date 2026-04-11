import {
    MdAnalytics,
    MdDashboard,
    MdHistory,
    MdPerson,
    MdRestaurantMenu,
    MdShoppingCart,
    MdPhotoCamera,
} from 'react-icons/md';
import Dashboard from '../pages/Dashboard';
import GroceryPlanner from '../pages/GroceryPlanner';
import MealHistory from '../pages/MealHistory';
import MealScanner from '../pages/MealScanner';
import NutritionAnalytics from '../pages/NutritionAnalytics';
import ProfileGoals from '../pages/ProfileGoals';
import RecipeGenerator from '../pages/RecipeGenerator';

export const routePaths = {
    dashboard: '/',
    scanMeal: '/scan-meal',
    mealHistory: '/meal-history',
    analytics: '/analytics',
    recipes: '/recipes',
    groceryPlanner: '/grocery-planner',
    profile: '/profile',
};

export const sidebarNavItems = [
    { to: routePaths.dashboard, label: 'Dashboard', icon: MdDashboard, end: true },
    { to: routePaths.scanMeal, label: 'Scan Meal', icon: MdPhotoCamera },
    { to: routePaths.mealHistory, label: 'Meal History', icon: MdHistory },
    { to: routePaths.analytics, label: 'Analytics', icon: MdAnalytics },
];

export const headerNavItems = [
    { to: routePaths.recipes, label: 'Recipes', icon: MdRestaurantMenu },
    { to: routePaths.groceryPlanner, label: 'Grocery Planner', icon: MdShoppingCart },
    { to: routePaths.profile, label: 'Profile', icon: MdPerson },
];

export const appRoutes = [
    { path: routePaths.dashboard, element: <Dashboard /> },
    { path: routePaths.scanMeal, element: <MealScanner /> },
    { path: routePaths.mealHistory, element: <MealHistory /> },
    { path: routePaths.analytics, element: <NutritionAnalytics /> },
    { path: routePaths.recipes, element: <RecipeGenerator /> },
    { path: routePaths.groceryPlanner, element: <GroceryPlanner /> },
    { path: routePaths.profile, element: <ProfileGoals /> },
];

export const legacyRedirects = [
    { from: '/meal-scanner', to: routePaths.scanMeal },
    { from: '/nutrition-analytics', to: routePaths.analytics },
    { from: '/recipe-generator', to: routePaths.recipes },
    { from: '/habit-insights', to: routePaths.analytics },
];
