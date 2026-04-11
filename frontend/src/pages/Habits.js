import React from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const Habits = () => {
    const habits = [
        { name: 'Drink 8 glasses of water', streak: 7, target: 8, completed: 7 },
        { name: 'Eat vegetables with every meal', streak: 5, target: 3, completed: 3 },
        { name: 'Limit sugary drinks', streak: 12, target: 0, completed: 0 },
        { name: 'Track all meals', streak: 3, target: 3, completed: 3 },
        { name: 'Exercise 30 minutes', streak: 2, target: 5, completed: 2 },
        { name: 'Sleep 8 hours', streak: 4, target: 7, completed: 6 },
    ];

    return (
        <PageContainer>
            <SectionHeader
                title="Habits"
                subtitle="Build healthy habits and track your progress."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: theme.spacing.lg }}>
                {habits.map((habit, index) => (
                    <AppCard key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.lg }}>
                            <div>
                                <h3 style={{ ...theme.typography.body, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.sm, fontWeight: 600 }}>
                                    {habit.name}
                                </h3>
                                <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
                                    {habit.streak} day streak
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ ...theme.typography.body, color: theme.colors.textPrimary, margin: 0, fontWeight: 600 }}>
                                    {habit.completed}/{habit.target}
                                </p>
                                <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0, fontSize: '12px' }}>
                                    today
                                </p>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: theme.colors.border, borderRadius: '4px', marginBottom: theme.spacing.md }}>
                            <div
                                style={{
                                    width: `${(habit.completed / habit.target) * 100}%`,
                                    height: '100%',
                                    backgroundColor: habit.completed === habit.target ? theme.colors.secondary : theme.colors.primary,
                                    borderRadius: '4px',
                                    transition: 'width 300ms ease',
                                }}
                            />
                        </div>
                        <AppButton
                            variant={habit.completed === habit.target ? 'secondary' : 'primary'}
                            style={{ width: '100%' }}
                        >
                            {habit.completed === habit.target ? 'Completed ✓' : 'Mark Complete'}
                        </AppButton>
                    </AppCard>
                ))}
            </div>

            <AppCard style={{ marginTop: theme.spacing.xxl }}>
                <SectionHeader title="Habit Insights" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl, '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
                    <div>
                        <h4 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.md }}>
                            This Week
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                💧 Water intake: 85% completion rate
                            </li>
                            <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                🥦 Vegetable consumption: 67% completion rate
                            </li>
                            <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                🚫 Sugary drinks: 92% success rate
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.md }}>
                            Recommendations
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                🎯 Try setting reminders for water breaks
                            </li>
                            <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                📈 Increase vegetable portions gradually
                            </li>
                            <li style={{ ...theme.typography.body, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                                🏆 Reward yourself for habit streaks
                            </li>
                        </ul>
                    </div>
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default Habits;