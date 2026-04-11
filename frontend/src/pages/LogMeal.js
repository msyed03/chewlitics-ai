import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const LogMeal = () => {
    const [food, setFood] = useState('');
    const [calories, setCalories] = useState('');

    const handleSubmit = async () => {
        if (!food || !calories) return;

        try {
            await fetch('http://127.0.0.1:8000/meals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    food_label: food,
                    calories: parseFloat(calories),
                }),
            });
            alert('Meal logged successfully!');
            setFood('');
            setCalories('');
        } catch (error) {
            alert('Error logging meal. Please try again.');
        }
    };

    const quickMeals = [
        { name: 'Apple', calories: 95 },
        { name: 'Banana', calories: 105 },
        { name: 'Chicken Breast (100g)', calories: 165 },
        { name: 'Rice (1 cup cooked)', calories: 205 },
        { name: 'Salad', calories: 150 },
        { name: 'Protein Shake', calories: 250 },
    ];

    return (
        <PageContainer>
            <SectionHeader
                title="Log Meal"
                subtitle="Track your nutrition by logging your meals."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xxl, '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
                <AppCard>
                    <SectionHeader title="Manual Entry" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                        <div>
                            <label style={{ ...theme.typography.body, color: theme.colors.textPrimary, display: 'block', marginBottom: theme.spacing.sm }}>
                                Food Item
                            </label>
                            <input
                                type="text"
                                value={food}
                                onChange={(e) => setFood(e.target.value)}
                                placeholder="e.g., Grilled Chicken Salad"
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.md,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.body.fontSize,
                                    outline: 'none',
                                    '&:focus': { borderColor: theme.colors.primary },
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ ...theme.typography.body, color: theme.colors.textPrimary, display: 'block', marginBottom: theme.spacing.sm }}>
                                Calories
                            </label>
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                placeholder="e.g., 450"
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.md,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.body.fontSize,
                                    outline: 'none',
                                    '&:focus': { borderColor: theme.colors.primary },
                                }}
                            />
                        </div>
                        <AppButton onClick={handleSubmit} disabled={!food || !calories}>
                            Log Meal
                        </AppButton>
                    </div>
                </AppCard>

                <AppCard>
                    <SectionHeader title="Quick Add" subtitle="Common meals for faster logging" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                        {quickMeals.map((meal, index) => (
                            <AppButton
                                key={index}
                                variant="secondary"
                                onClick={() => {
                                    setFood(meal.name);
                                    setCalories(meal.calories.toString());
                                }}
                                style={{ justifyContent: 'space-between', height: 'auto', padding: theme.spacing.md }}
                            >
                                <span>{meal.name}</span>
                                <span style={{ color: theme.colors.textSecondary }}>{meal.calories} cal</span>
                            </AppButton>
                        ))}
                    </div>
                </AppCard>
            </div>

            <AppCard style={{ marginTop: theme.spacing.xxl }}>
                <SectionHeader title="Recent Meals" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.md }}>
                        <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Grilled Chicken Salad</span>
                        <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>450 cal</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.md }}>
                        <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Protein Shake</span>
                        <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>250 cal</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.md }}>
                        <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Oatmeal</span>
                        <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>300 cal</span>
                    </div>
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default LogMeal;