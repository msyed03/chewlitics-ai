import React, { useState, useEffect } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MealHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingMeal, setEditingMeal] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', mealType: '' });

    const parseTimestamp = (timestamp) => new Date(timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/meals`);
            if (!response.ok) throw new Error('Failed to fetch meals');
            const data = await response.json();
            setMeals(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        // eslint-disable-next-line no-restricted-globals
        const confirmed = window['confirm']('Are you sure you want to delete this meal?');
        if (!confirmed) return;
        try {
            const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete meal');
            setMeals(meals.filter(meal => meal.id !== mealId));
        } catch (err) {
            alert('Error deleting meal: ' + err.message);
        }
    };

    const handleEditMeal = (meal) => {
        setEditingMeal(meal);
        setEditForm({
            description: meal.original_description,
            mealType: meal.meal_type || ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editingMeal) return;
        try {
            const response = await fetch(`${API_BASE_URL}/meals/${editingMeal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_description: editForm.description,
                    meal_type: editForm.mealType || null
                })
            });
            if (!response.ok) throw new Error('Failed to update meal');
            const updatedMeal = await response.json();
            setMeals(meals.map(meal => meal.id === editingMeal.id ? updatedMeal : meal));
            setEditingMeal(null);
        } catch (err) {
            alert('Error updating meal: ' + err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingMeal(null);
    };

    // Group meals by date
    const groupedMeals = meals.reduce((groups, meal) => {
        const date = parseTimestamp(meal.timestamp).toLocaleDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(meal);
        return groups;
    }, {});

    const filteredMeals = Object.entries(groupedMeals).map(([date, dayMeals]) => ({
        date,
        items: dayMeals.filter(meal => {
            const matchesSearch = meal.original_description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'all' || (meal.meal_type && meal.meal_type === filterType);
            return matchesSearch && matchesFilter;
        })
    })).filter(dayGroup => dayGroup.items.length > 0);

    const getMealIcon = (type) => {
        const icons = { breakfast: '🥣', lunch: '🥗', dinner: '🍗', snack: '🥪' };
        return icons[type] || '🍽️';
    };

    if (loading) {
        return (
            <PageContainer>
                <SectionHeader title="Meal History" subtitle="Loading your meals..." />
                <AppCard style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
                    <p>Loading...</p>
                </AppCard>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <SectionHeader title="Meal History" subtitle="Error loading meals" />
                <AppCard style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
                    <p style={{ color: theme.colors.danger }}>{error}</p>
                    <AppButton onClick={fetchMeals}>Retry</AppButton>
                </AppCard>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <SectionHeader
                title="Meal History"
                subtitle="View all logged meals with detailed nutrition breakdowns."
            />

            {/* Search and Filter Bar */}
            <AppCard style={{ marginBottom: theme.spacing.xxl }}>
                <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg, '@media (max-width: 768px)': { flexDirection: 'column' } }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Search meals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: theme.spacing.md,
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: theme.borderRadius.md,
                                fontSize: theme.typography.body.fontSize,
                                outline: 'none',
                            }}
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: theme.spacing.md,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.typography.body.fontSize,
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="all">All Meals</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snacks</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
                    <span style={{ ...theme.typography.small, color: theme.colors.textSecondary, alignSelf: 'center' }}>
                        Found {filteredMeals.reduce((sum, day) => sum + day.items.length, 0)} meals
                    </span>
                </div>
            </AppCard>

            {/* Meals List */}
            {filteredMeals.length > 0 ? (
                filteredMeals.map((dayGroup, dayIndex) => (
                    <div key={dayIndex} style={{ marginBottom: theme.spacing.xxl }}>
                        <h3 style={{
                            ...theme.typography.sectionHeading,
                            color: theme.colors.textPrimary,
                            marginBottom: theme.spacing.lg,
                            paddingLeft: theme.spacing.lg,
                        }}>
                            {dayGroup.date}
                        </h3>
                        <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                            {dayGroup.items.map((meal, mealIndex) => (
                                <AppCard key={mealIndex} style={{
                                    cursor: 'pointer',
                                    transition: 'all 200ms ease',
                                    borderLeft: `4px solid ${theme.colors.primary}`,
                                }}>
                                    <div style={{ display: 'flex', gap: theme.spacing.lg, alignItems: 'flex-start' }}>
                                        <div style={{
                                            fontSize: '40px',
                                            minWidth: '50px',
                                            textAlign: 'center',
                                        }}>
                                            {getMealIcon(meal.meal_type)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.sm }}>
                                                {meal.original_description}
                                            </h4>
                                            <div style={{ display: 'flex', gap: theme.spacing.lg, flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
                                                <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                                                    ⏰ {parseTimestamp(meal.timestamp).toLocaleTimeString()}
                                                </span>
                                                <span style={{
                                                    ...theme.typography.small,
                                                    padding: '2px 8px',
                                                    backgroundColor: theme.colors.secondary + '20',
                                                    color: theme.colors.secondary,
                                                    borderRadius: theme.borderRadius.sm,
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {meal.meal_type || 'meal'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                                                {meal.calories}
                                            </p>
                                            <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                                                calories
                                            </p>
                                            <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                                                <AppButton
                                                    variant="secondary"
                                                    style={{ fontSize: '12px', height: 'auto', padding: '6px 12px' }}
                                                    onClick={() => handleEditMeal(meal)}
                                                >
                                                    ✏️ Edit
                                                </AppButton>
                                                <AppButton
                                                    variant="secondary"
                                                    style={{ fontSize: '12px', height: 'auto', padding: '6px 12px' }}
                                                    onClick={() => handleDeleteMeal(meal.id)}
                                                >
                                                    🗑️ Delete
                                                </AppButton>
                                            </div>
                                        </div>
                                    </div>
                                </AppCard>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <AppCard style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
                    <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
                        No meals found matching your search.
                    </p>
                </AppCard>
            )}

            {/* Statistics Card */}
            <AppCard>
                <SectionHeader title="History Statistics" />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: theme.spacing.lg,
                }}>
                    <div style={{ textAlign: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm }}>
                            Total Meals Logged
                        </p>
                        <p style={{ ...theme.typography.heroHeading, color: theme.colors.primary, margin: 0 }}>
                            {meals.length}
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm }}>
                            Avg. Daily Calories
                        </p>
                        <p style={{ ...theme.typography.heroHeading, color: theme.colors.secondary, margin: 0 }}>
                            {meals.length > 0 ? Math.round(meals.reduce((sum, m) => sum + m.calories, 0) / Math.max(1, new Set(meals.map(m => parseTimestamp(m.timestamp).toDateString())).size)) : 0}
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm }}>
                            Total Days Logged
                        </p>
                        <p style={{ ...theme.typography.heroHeading, color: '#F59E0B', margin: 0 }}>
                            {new Set(meals.map(m => parseTimestamp(m.timestamp).toDateString())).size}
                        </p>
                    </div>
                </div>
            </AppCard>

            {/* Edit Modal */}
            {editingMeal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <AppCard style={{
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                    }}>
                        <SectionHeader title="Edit Meal" />
                        <div style={{ marginBottom: theme.spacing.lg }}>
                            <label style={{
                                display: 'block',
                                marginBottom: theme.spacing.sm,
                                fontWeight: 600,
                                color: theme.colors.textPrimary,
                            }}>
                                Meal Description
                            </label>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: theme.spacing.md,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.body.fontSize,
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    resize: 'vertical',
                                }}
                                placeholder="Describe your meal..."
                            />
                        </div>
                        <div style={{ marginBottom: theme.spacing.xl }}>
                            <label style={{
                                display: 'block',
                                marginBottom: theme.spacing.sm,
                                fontWeight: 600,
                                color: theme.colors.textPrimary,
                            }}>
                                Meal Type
                            </label>
                            <select
                                value={editForm.mealType}
                                onChange={(e) => setEditForm({ ...editForm, mealType: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.md,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.body.fontSize,
                                    outline: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="">Select meal type...</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end' }}>
                            <AppButton variant="secondary" onClick={handleCancelEdit}>
                                Cancel
                            </AppButton>
                            <AppButton onClick={handleSaveEdit}>
                                Save Changes
                            </AppButton>
                        </div>
                    </AppCard>
                </div>
            )}
        </PageContainer>
    );
};

export default MealHistory;