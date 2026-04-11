import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const Insights = () => {
    const insights = [
        {
            title: 'Calorie Intake Trend',
            description: 'Your average daily calories have decreased by 8% this week. Great progress!',
            type: 'positive',
            icon: '📈',
        },
        {
            title: 'Protein Goals',
            description: 'You\'re consistently meeting your protein targets. Keep it up!',
            type: 'positive',
            icon: '💪',
        },
        {
            title: 'Meal Timing',
            description: 'Consider eating your largest meal earlier in the day for better energy distribution.',
            type: 'suggestion',
            icon: '⏰',
        },
        {
            title: 'Hydration Reminder',
            description: 'Your water intake has been below target for the last 3 days.',
            type: 'warning',
            icon: '💧',
        },
    ];

    const weeklyStats = [
        { day: 'Mon', calories: 2100, protein: 110 },
        { day: 'Tue', calories: 1950, protein: 105 },
        { day: 'Wed', calories: 2200, protein: 120 },
        { day: 'Thu', calories: 1850, protein: 95 },
        { day: 'Fri', calories: 2000, protein: 115 },
        { day: 'Sat', calories: 2300, protein: 125 },
        { day: 'Sun', calories: 1900, protein: 100 },
    ];

    return (
        <PageContainer>
            <SectionHeader
                title="Insights"
                subtitle="AI-powered insights to help you optimize your nutrition."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg, marginBottom: theme.spacing.xxl }}>
                {insights.map((insight, index) => (
                    <AppCard key={index}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.md }}>
                            <span style={{ fontSize: '24px' }}>{insight.icon}</span>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ ...theme.typography.body, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.sm, fontWeight: 600 }}>
                                    {insight.title}
                                </h3>
                                <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    </AppCard>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.xxl }}>
                <AppCard>
                    <SectionHeader title="Weekly Overview" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                        <div>
                            <h4 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0 }}>
                                Average Daily Calories
                            </h4>
                            <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
                                2049 calories • 7% below target
                            </p>
                        </div>
                        <AppButton variant="secondary">View Details</AppButton>
                    </div>
                    <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'end', height: '200px' }}>
                        {weeklyStats.map((stat, index) => (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: `${(stat.calories / 2500) * 100}%`,
                                        backgroundColor: theme.colors.primary,
                                        borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
                                        marginBottom: theme.spacing.sm,
                                    }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px' }}>
                                    {stat.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </AppCard>

                <AppCard>
                    <SectionHeader title="Nutrition Breakdown" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.lg }}>
                        <div>
                            <h4 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.sm }}>
                                Macronutrients
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Protein</span>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>108g (43%)</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: theme.colors.border, borderRadius: '3px' }}>
                                    <div style={{ width: '43%', height: '100%', backgroundColor: theme.colors.secondary, borderRadius: '3px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Carbs</span>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>245g (39%)</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: theme.colors.border, borderRadius: '3px' }}>
                                    <div style={{ width: '39%', height: '100%', backgroundColor: theme.colors.primary, borderRadius: '3px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Fat</span>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>78g (18%)</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: theme.colors.border, borderRadius: '3px' }}>
                                    <div style={{ width: '18%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '3px' }} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.sm }}>
                                Key Insights
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                    🎯 Protein intake is excellent
                                </li>
                                <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                    📊 Consider reducing carb portions
                                </li>
                                <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                    🥑 Add more healthy fats
                                </li>
                                <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                    💧 Increase water consumption
                                </li>
                            </ul>
                        </div>
                    </div>
                </AppCard>
            </div>
        </PageContainer>
    );
};

export default Insights;