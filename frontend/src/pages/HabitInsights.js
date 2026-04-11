import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const HabitInsights = () => {
    const [expandedHabit, setExpandedHabit] = useState(null);

    const habits = [
        {
            id: 1,
            name: 'Daily Logging',
            emoji: '📝',
            score: 92,
            streak: 28,
            trend: '+8%',
            trendPositive: true,
            description: 'Consistency in logging meals',
            details: 'You\'ve logged 28 consecutive days without missing a meal entry.',
        },
        {
            id: 2,
            name: 'Water Intake',
            emoji: '💧',
            score: 78,
            streak: 15,
            trend: '+3%',
            trendPositive: true,
            description: 'Daily hydration goal',
            details: '15-day streak of hitting 8+ glasses per day. Great progress!',
        },
        {
            id: 3,
            name: 'Workout Consistency',
            emoji: '🏋️',
            score: 65,
            streak: 8,
            trend: '-2%',
            trendPositive: false,
            description: 'Exercise frequency tracking',
            details: 'Working on getting back on track with 8-day current streak.',
        },
        {
            id: 4,
            name: 'Protein Goal',
            emoji: '🥚',
            score: 88,
            streak: 22,
            trend: '+5%',
            trendPositive: true,
            description: 'Daily protein targets',
            details: '22 days hitting 100g+ protein daily. Strong commitment!',
        },
        {
            id: 5,
            name: 'Sleep Tracking',
            emoji: '😴',
            score: 72,
            streak: 12,
            trend: '+1%',
            trendPositive: true,
            description: '7+ hours per night',
            details: 'Averaging 7.2 hours of sleep on your tracked nights.',
        },
        {
            id: 6,
            name: 'Meal Planning',
            emoji: '🍽️',
            score: 81,
            streak: 18,
            trend: '+6%',
            trendPositive: true,
            description: 'Weekly meal prep',
            details: 'Completed meal planning for 18 consecutive weeks.',
        },
    ];

    const getHealthScoreColor = (score) => {
        if (score >= 85) return theme.colors.secondary;
        if (score >= 70) return theme.colors.primary;
        if (score >= 50) return '#F59E0B';
        return theme.colors.danger;
    };

    const getHealthScoreLabel = (score) => {
        if (score >= 85) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        return 'Needs Work';
    };

    const overallScore = Math.round(habits.reduce((sum, h) => sum + h.score, 0) / habits.length);

    return (
        <PageContainer>
            <SectionHeader
                title="Habit Insights"
                subtitle="Track your wellness patterns and behavioral consistency"
            />

            {/* Overall Health Score */}
            <AppCard style={{ marginBottom: theme.spacing.xxl }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xxl, alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            backgroundColor: getHealthScoreColor(overallScore) + '15',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `3px solid ${getHealthScoreColor(overallScore)}`,
                        }}>
                            <p style={{
                                ...theme.typography.heroHeading,
                                color: getHealthScoreColor(overallScore),
                                margin: 0,
                                lineHeight: 1,
                            }}>
                                {overallScore}
                            </p>
                            <p style={{
                                ...theme.typography.small,
                                color: theme.colors.textSecondary,
                                margin: '8px 0 0 0',
                            }}>
                                {getHealthScoreLabel(overallScore)}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.lg }}>
                            Your Wellness Score
                        </h3>
                        <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
                            Based on 6 core habits you're tracking, your overall wellness score is <strong>{overallScore}/100</strong>.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                            {[
                                { label: 'Daily Logging', status: '✅' },
                                { label: 'Protein Goals', status: '✅' },
                                { label: 'Hydration', status: '⚠️' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>{item.label}</span>
                                    <span style={{ fontSize: '18px' }}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AppCard>

            {/* Habit Details Grid */}
            <div style={{ marginBottom: theme.spacing.xxl }}>
                <SectionHeader title="Your Habits" subtitle="Click any habit to see detailed insights" />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: theme.spacing.lg,
                }}>
                    {habits.map((habit) => (
                        <AppCard
                            key={habit.id}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                                backgroundColor: expandedHabit === habit.id ? theme.colors.primary + '08' : theme.colors.surface,
                                borderLeft: expandedHabit === habit.id ? `4px solid ${theme.colors.primary}` : '4px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = theme.shadows.card;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onClick={() => setExpandedHabit(expandedHabit === habit.id ? null : habit.id)}
                        >
                            <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                                <span style={{ fontSize: '32px' }}>{habit.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        {habit.name}
                                    </h4>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                                        {habit.description}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                                <div style={{ backgroundColor: theme.colors.background, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg }}>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        Habit Score
                                    </p>
                                    <p style={{ ...theme.typography.sectionHeading, color: getHealthScoreColor(habit.score), margin: 0 }}>
                                        {habit.score}
                                    </p>
                                </div>
                                <div style={{ backgroundColor: theme.colors.background, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg }}>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        Current Streak
                                    </p>
                                    <p style={{ ...theme.typography.sectionHeading, color: theme.colors.secondary, margin: 0 }}>
                                        {habit.streak} 📅
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.colors.border}` }}>
                                <span style={{
                                    padding: '4px 12px',
                                    backgroundColor: habit.trendPositive ? theme.colors.secondary + '20' : theme.colors.danger + '20',
                                    color: habit.trendPositive ? theme.colors.secondary : theme.colors.danger,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: '12px',
                                    fontWeight: 600,
                                }}>
                                    {habit.trend} {habit.trendPositive ? '📈' : '📉'}
                                </span>
                                <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                                    30-day trend
                                </span>
                            </div>

                            {expandedHabit === habit.id && (
                                <div style={{
                                    marginTop: theme.spacing.lg,
                                    paddingTop: theme.spacing.lg,
                                    borderTop: `1px solid ${theme.colors.border}`,
                                }}>
                                    <p style={{ ...theme.typography.body, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.md }}>
                                        {habit.details}
                                    </p>
                                    <div style={{ display: 'flex', gap: theme.spacing.md }}>
                                        <AppButton variant="primary" onClick={(e) => { e.stopPropagation(); }} style={{ flex: 1, fontSize: '12px' }}>
                                            View History
                                        </AppButton>
                                        <AppButton variant="secondary" onClick={(e) => { e.stopPropagation(); }} style={{ flex: 1, fontSize: '12px' }}>
                                            Set Goal
                                        </AppButton>
                                    </div>
                                </div>
                            )}
                        </AppCard>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <AppCard>
                <SectionHeader title="Personalized Recommendations" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                    {[
                        { icon: '💪', title: 'Boost Workout Consistency', desc: 'Your exercise streak is declining. Try scheduling workouts for the same time each day.', action: 'Set Reminder' },
                        { icon: '💧', title: 'Hydration Challenge', desc: 'Increase water intake by 1 glass daily to improve your score from 78 to 85+.', action: 'Accept Challenge' },
                        { icon: '🎯', title: 'Maintain Your Momentum', desc: 'Your daily logging habit is excellent! Keep up this streak for 2 more days to reach 30.', action: 'View Milestone' },
                    ].map((rec, index) => (
                        <div
                            key={index}
                            style={{
                                padding: theme.spacing.lg,
                                backgroundColor: theme.colors.background,
                                borderRadius: theme.borderRadius.lg,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', gap: theme.spacing.md }}>
                                <span style={{ fontSize: '24px' }}>{rec.icon}</span>
                                <div>
                                    <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        {rec.title}
                                    </h4>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                                        {rec.desc}
                                    </p>
                                </div>
                            </div>
                            <AppButton variant="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                                {rec.action}
                            </AppButton>
                        </div>
                    ))}
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default HabitInsights;