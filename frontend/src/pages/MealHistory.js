import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const MealHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const meals = [
        {
            date: 'Today', items: [
                { name: 'Grilled Chicken Salad', time: '12:30 PM', calories: 450, confidence: 98, type: 'lunch' },
                { name: 'Protein Shake', time: '4:00 PM', calories: 250, confidence: 95, type: 'snack' },
                { name: 'Brown Rice & Broccoli', time: '7:00 PM', calories: 520, confidence: 92, type: 'dinner' },
            ]
        },
        {
            date: 'Yesterday', items: [
                { name: 'Oatmeal with Berries', time: '8:00 AM', calories: 380, confidence: 94, type: 'breakfast' },
                { name: 'Tuna Sandwich', time: '12:45 PM', calories: 520, confidence: 89, type: 'lunch' },
                { name: 'Grilled Fish & Vegetables', time: '6:30 PM', calories: 580, confidence: 96, type: 'dinner' },
            ]
        },
        {
            date: '2 Days Ago', items: [
                { name: 'Eggs & Toast', time: '7:30 AM', calories: 420, confidence: 91, type: 'breakfast' },
                { name: 'Caesar Salad', time: '1:00 PM', calories: 380, confidence: 87, type: 'lunch' },
                { name: 'Turkey Tacos', time: '6:45 PM', calories: 580, confidence: 90, type: 'dinner' },
            ]
        },
    ];

    const filteredMeals = meals.map(dayGroup => ({
        ...dayGroup,
        items: dayGroup.items.filter(meal => {
            const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'all' || meal.type === filterType;
            return matchesSearch && matchesFilter;
        })
    })).filter(dayGroup => dayGroup.items.length > 0);

    const getMealIcon = (type) => {
        const icons = { breakfast: '🥣', lunch: '🥗', dinner: '🍗', snack: '🥪' };
        return icons[type] || '🍽️';
    };

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
                                            {getMealIcon(meal.type)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.sm }}>
                                                {meal.name}
                                            </h4>
                                            <div style={{ display: 'flex', gap: theme.spacing.lg, flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
                                                <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                                                    ⏰ {meal.time}
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
                                                    {meal.type}
                                                </span>
                                                <span style={{
                                                    ...theme.typography.small,
                                                    padding: '2px 8px',
                                                    backgroundColor: `${theme.colors.primary}20`,
                                                    color: theme.colors.primary,
                                                    borderRadius: theme.borderRadius.sm,
                                                    fontWeight: 600,
                                                }}>
                                                    AI Confidence: {meal.confidence}%
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
                                                <AppButton variant="secondary" style={{ fontSize: '12px', height: 'auto', padding: '6px 12px' }}>
                                                    ✏️ Edit
                                                </AppButton>
                                                <AppButton variant="secondary" style={{ fontSize: '12px', height: 'auto', padding: '6px 12px' }}>
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
                            156
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm }}>
                            Avg. Daily Calories
                        </p>
                        <p style={{ ...theme.typography.heroHeading, color: theme.colors.secondary, margin: 0 }}>
                            2,150
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm }}>
                            Scanning Streak
                        </p>
                        <p style={{ ...theme.typography.heroHeading, color: '#F59E0B', margin: 0 }}>
                            12 days
                        </p>
                    </div>
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default MealHistory;