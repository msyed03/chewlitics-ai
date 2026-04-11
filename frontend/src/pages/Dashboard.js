import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const Dashboard = () => {
    const stats = [
        { label: 'Total Meals', value: '24', change: '+12%' },
        { label: 'Calories Today', value: '1850', change: '-5%' },
        { label: 'Habits Tracked', value: '8', change: '+2' },
        { label: 'Insights Generated', value: '15', change: '+8%' },
    ];

    return (
        <PageContainer>
            <SectionHeader
                title="Dashboard"
                subtitle="Welcome back! Here's your nutrition overview."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: theme.spacing.lg, marginBottom: theme.spacing.xxl }}>
                {stats.map((stat, index) => (
                    <AppCard key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm }}>
                                    {stat.label}
                                </p>
                                <p style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0 }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div style={{ color: stat.change.startsWith('+') ? theme.colors.secondary : theme.colors.danger, fontSize: '14px', fontWeight: 600 }}>
                                {stat.change}
                            </div>
                        </div>
                    </AppCard>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl, '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
                <AppCard>
                    <SectionHeader title="Recent Meals" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Grilled Chicken Salad</span>
                            <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>450 cal</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Protein Shake</span>
                            <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>250 cal</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Oatmeal</span>
                            <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>300 cal</span>
                        </div>
                    </div>
                    <AppButton style={{ marginTop: theme.spacing.lg }}>View All Meals</AppButton>
                </AppCard>

                <AppCard>
                    <SectionHeader title="Today's Goals" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Calories</span>
                            <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>1850 / 2200</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: theme.colors.border, borderRadius: '4px' }}>
                            <div style={{ width: '84%', height: '100%', backgroundColor: theme.colors.primary, borderRadius: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>Protein</span>
                            <span style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>85g / 120g</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: theme.colors.border, borderRadius: '4px' }}>
                            <div style={{ width: '71%', height: '100%', backgroundColor: theme.colors.secondary, borderRadius: '4px' }} />
                        </div>
                    </div>
                </AppCard>
            </div>
        </PageContainer>
    );
};

export default Dashboard;