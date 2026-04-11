import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const GroceryPlanner = () => {
    const [selectedPlan, setSelectedPlan] = useState('weekly');
    const [checkedItems, setCheckedItems] = useState({});

    const toggleItem = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const groceryItems = [
        { id: 1, category: 'Proteins', item: 'Chicken Breast (3 lbs)', checked: false, quantity: 3 },
        { id: 2, category: 'Proteins', item: 'Salmon Fillets (2 lbs)', checked: false, quantity: 2 },
        { id: 3, category: 'Proteins', item: 'Greek Yogurt (32 oz)', checked: false, quantity: 2 },
        { id: 4, category: 'Grains', item: 'Brown Rice (5 lbs)', checked: false, quantity: 1 },
        { id: 5, category: 'Grains', item: 'Oats (32 oz)', checked: false, quantity: 1 },
        { id: 6, category: 'Vegetables', item: 'Broccoli', checked: false, quantity: 3 },
        { id: 7, category: 'Vegetables', item: 'Carrots', checked: false, quantity: 2 },
        { id: 8, category: 'Vegetables', item: 'Spinach (5 oz)', checked: false, quantity: 2 },
        { id: 9, category: 'Fruits', item: 'Bananas', checked: false, quantity: 2 },
        { id: 10, category: 'Fruits', item: 'Blueberries (1 lb)', checked: false, quantity: 1 },
        { id: 11, category: 'Dairy', item: 'Milk (half gal)', checked: false, quantity: 1 },
        { id: 12, category: 'Condiments', item: 'Olive Oil', checked: false, quantity: 1 },
    ];

    const weeklyPlans = [
        {
            day: 'Monday',
            meals: [
                { time: 'Breakfast', name: 'Oatmeal with Berries' },
                { time: 'Lunch', name: 'Grilled Chicken & Rice' },
                { time: 'Dinner', name: 'Salmon with Broccoli' },
            ]
        },
        {
            day: 'Tuesday',
            meals: [
                { time: 'Breakfast', name: 'Protein Shake' },
                { time: 'Lunch', name: 'Tuna Salad' },
                { time: 'Dinner', name: 'Chicken Stir-Fry' },
            ]
        },
        {
            day: 'Wednesday',
            meals: [
                { time: 'Breakfast', name: 'Eggs & Toast' },
                { time: 'Lunch', name: 'Quinoa Bowl' },
                { time: 'Dinner', name: 'Turkey Tacos' },
            ]
        },
    ];

    return (
        <PageContainer>
            <SectionHeader
                title="Grocery Planner"
                subtitle="Plan meals for the week and auto-generate shopping lists."
            />

            {/* Meal Planning Section */}
            <AppCard style={{ marginBottom: theme.spacing.xxl }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                    <SectionHeader title="Weekly Meal Plan" />
                    <div style={{ display: 'flex', gap: theme.spacing.md }}>
                        <AppButton variant="secondary" onClick={() => setSelectedPlan('weekly')} style={{
                            backgroundColor: selectedPlan === 'weekly' ? theme.colors.primary : 'white',
                            color: selectedPlan === 'weekly' ? 'white' : theme.colors.textPrimary,
                        }}>
                            Weekly
                        </AppButton>
                        <AppButton variant="secondary" onClick={() => setSelectedPlan('bi-weekly')} style={{
                            backgroundColor: selectedPlan === 'bi-weekly' ? theme.colors.primary : 'white',
                            color: selectedPlan === 'bi-weekly' ? 'white' : theme.colors.textPrimary,
                        }}>
                            Bi-Weekly
                        </AppButton>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg }}>
                    {weeklyPlans.map((plan, index) => (
                        <div
                            key={index}
                            style={{
                                padding: theme.spacing.lg,
                                backgroundColor: theme.colors.background,
                                borderRadius: theme.borderRadius.lg,
                                border: `1px solid ${theme.colors.border}`,
                            }}
                        >
                            <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.md }}>
                                {plan.day}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                                {plan.meals.map((meal, mealIndex) => (
                                    <div key={mealIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ ...theme.typography.small, color: theme.colors.textSecondary, fontWeight: 500 }}>
                                            {meal.time}
                                        </span>
                                        <span style={{ ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: 500 }}>
                                            {meal.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <AppButton variant="secondary" style={{ width: '100%', marginTop: theme.spacing.lg, fontSize: '13px', height: '40px' }}>
                                Edit Day
                            </AppButton>
                        </div>
                    ))}
                </div>
                <AppButton style={{ width: '100%', marginTop: theme.spacing.lg }}>
                    ➕ Add More Days
                </AppButton>
            </AppCard>

            {/* Shopping List Section */}
            <div style={{ marginBottom: theme.spacing.xxl }}>
                <SectionHeader title="Auto-Generated Shopping List" subtitle="Based on your meal plan" />

                <AppCard style={{ marginBottom: theme.spacing.lg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                        <div>
                            <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
                                Items: {groceryItems.length}
                            </p>
                            <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                                {Object.values(checkedItems).filter(Boolean).length} checked
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: theme.spacing.md }}>
                            <AppButton variant="secondary">🔄 Refresh List</AppButton>
                            <AppButton>📥 Export to PDF</AppButton>
                        </div>
                    </div>
                </AppCard>

                {/* Category-grouped items */}
                <div style={{ display: 'grid', gap: theme.spacing.lg }}>
                    {Object.entries(
                        groceryItems.reduce((acc, item) => ({
                            ...acc,
                            [item.category]: [...(acc[item.category] || []), item]
                        }), {})
                    ).map(([category, items]) => (
                        <AppCard key={category}>
                            <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.lg }}>
                                {category}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: theme.spacing.md,
                                            padding: theme.spacing.md,
                                            backgroundColor: checkedItems[item.id] ? theme.colors.border : theme.colors.background,
                                            borderRadius: theme.borderRadius.lg,
                                            cursor: 'pointer',
                                            transition: 'all 200ms ease',
                                            opacity: checkedItems[item.id] ? 0.6 : 1,
                                            textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                                        }}
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checkedItems[item.id] || false}
                                            onChange={() => toggleItem(item.id)}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                        <span style={{ flex: 1, ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: 500 }}>
                                            {item.item}
                                        </span>
                                        <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                                            x{item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </AppCard>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <AppCard>
                <SectionHeader title="Shopping Assistant" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg, '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
                    <AppButton style={{ height: 'auto', padding: theme.spacing.lg }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>🤖</div>
                            <div style={{ fontWeight: 600 }}>Smart Shopping Tips</div>
                            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: theme.spacing.xs }}>See efficient swaps and pantry reminders</div>
                        </div>
                    </AppButton>
                    <AppButton variant="secondary" style={{ height: 'auto', padding: theme.spacing.lg }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>🏪</div>
                            <div style={{ fontWeight: 600 }}>Find Stores</div>
                            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: theme.spacing.xs }}>Find items near you</div>
                        </div>
                    </AppButton>
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default GroceryPlanner;
