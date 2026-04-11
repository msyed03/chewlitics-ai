import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const ProfileGoals = () => {
    const [profile, setProfile] = useState({
        name: 'Alex',
        email: 'alex@example.com',
        age: 28,
        height: '5\'10"',
        weight: 180,
        activityLevel: 'Moderate',
    });

    const [goals, setGoals] = useState([
        { label: 'Daily Calorie Target', value: 2200, unit: 'cal', description: 'Your personalized calorie goal' },
        { label: 'Protein Target', value: 120, unit: 'g/day', description: '0.66g per pound of body weight' },
        { label: 'Water Intake', value: 8, unit: 'glasses/day', description: 'Stay hydrated' },
        { label: 'Meals to Log', value: 3, unit: 'per day', description: 'Average meals per day' },
    ]);

    const [restrictions, setRestrictions] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
    });

    const [notifications, setNotifications] = useState({
        mealReminders: true,
        goalAlerts: true,
        weeklySummary: true,
        insightTips: false,
    });

    const [saveMessage, setSaveMessage] = useState('');

    const handleProfileChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    const handleGoalChange = (index, value) => {
        const newGoals = [...goals];
        newGoals[index].value = parseFloat(value);
        setGoals(newGoals);
    };

    const handleRestrictionChange = (field) => {
        setRestrictions({ ...restrictions, [field]: !restrictions[field] });
    };

    const handleNotificationChange = (field) => {
        setNotifications({ ...notifications, [field]: !notifications[field] });
    };

    const handleSaveProfile = () => {
        setSaveMessage('✓ Profile saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const handleSaveGoals = () => {
        setSaveMessage('✓ Goals updated successfully');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const handleSavePreferences = () => {
        setSaveMessage('✓ Preferences saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Profile & Goals"
                subtitle="Manage your personal information and nutrition targets"
            />

            {/* Save Message */}
            {saveMessage && (
                <div style={{
                    marginBottom: theme.spacing.lg,
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.secondary + '20',
                    color: theme.colors.secondary,
                    borderRadius: theme.borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                }}>
                    <span style={{ fontSize: '18px' }}>✓</span>
                    <span style={{ ...theme.typography.body, fontWeight: 600 }}>{saveMessage}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xxl, marginBottom: theme.spacing.xxl }}>
                {/* Profile Card */}
                <AppCard>
                    <SectionHeader title="Personal Information" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                        <div>
                            <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.sm }}>
                                Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.md,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.body.fontSize,
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.sm }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.md,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.body.fontSize,
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                            <div>
                                <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.sm }}>
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={profile.age}
                                    onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        fontSize: theme.typography.body.fontSize,
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.sm }}>
                                    Height
                                </label>
                                <input
                                    type="text"
                                    value={profile.height}
                                    onChange={(e) => handleProfileChange('height', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        fontSize: theme.typography.body.fontSize,
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                            <div>
                                <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.sm }}>
                                    Weight (lbs)
                                </label>
                                <input
                                    type="number"
                                    value={profile.weight}
                                    onChange={(e) => handleProfileChange('weight', parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        fontSize: theme.typography.body.fontSize,
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.sm }}>
                                    Activity Level
                                </label>
                                <select
                                    value={profile.activityLevel}
                                    onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                        fontSize: theme.typography.body.fontSize,
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <option>Sedentary</option>
                                    <option>Light</option>
                                    <option>Moderate</option>
                                    <option>Active</option>
                                    <option>Very Active</option>
                                </select>
                            </div>
                        </div>
                        <AppButton
                            onClick={handleSaveProfile}
                            style={{ width: '100%' }}
                        >
                            💾 Save Changes
                        </AppButton>
                    </div>
                </AppCard>

                {/* Goals Card */}
                <AppCard>
                    <SectionHeader title="Nutrition Goals" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                        {goals.map((goal, index) => (
                            <div key={index} style={{ paddingBottom: index < goals.length - 1 ? theme.spacing.lg : 0, borderBottom: index < goals.length - 1 ? `1px solid ${theme.colors.border}` : 'none' }}>
                                <label style={{ ...theme.typography.body, color: theme.colors.textSecondary, fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: theme.spacing.xs }}>
                                    {goal.label}
                                </label>
                                <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.sm, fontSize: '13px' }}>
                                    {goal.description}
                                </p>
                                <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        value={goal.value}
                                        onChange={(e) => handleGoalChange(index, e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: theme.spacing.md,
                                            border: `1px solid ${theme.colors.border}`,
                                            borderRadius: theme.borderRadius.md,
                                            fontSize: theme.typography.body.fontSize,
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <span style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textSecondary, whiteSpace: 'nowrap' }}>
                                        {goal.unit}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <AppButton
                            onClick={handleSaveGoals}
                            style={{ width: '100%' }}
                        >
                            🎯 Save Goals
                        </AppButton>
                    </div>
                </AppCard>
            </div>

            {/* Preferences Card */}
            <AppCard>
                <SectionHeader title="Preferences" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl, marginBottom: theme.spacing.lg }}>
                    <div>
                        <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.lg }}>
                            Dietary Restrictions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={restrictions.vegetarian}
                                    onChange={() => handleRestrictionChange('vegetarian')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🥬 Vegetarian</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={restrictions.vegan}
                                    onChange={() => handleRestrictionChange('vegan')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🌱 Vegan</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={restrictions.glutenFree}
                                    onChange={() => handleRestrictionChange('glutenFree')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🍞 Gluten-Free</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.lg }}>
                            Notifications
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={notifications.mealReminders}
                                    onChange={() => handleNotificationChange('mealReminders')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🔔 Meal Reminders</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={notifications.goalAlerts}
                                    onChange={() => handleNotificationChange('goalAlerts')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🎯 Goal Alerts</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={notifications.weeklySummary}
                                    onChange={() => handleNotificationChange('weeklySummary')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>📊 Weekly Summary</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={notifications.insightTips}
                                    onChange={() => handleNotificationChange('insightTips')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>💡 Insight Tips</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div style={{ paddingTop: theme.spacing.lg, borderTop: `1px solid ${theme.colors.border}` }}>
                    <AppButton
                        onClick={handleSavePreferences}
                        style={{ width: '100%' }}
                    >
                        ✓ Save Preferences
                    </AppButton>
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default ProfileGoals;
