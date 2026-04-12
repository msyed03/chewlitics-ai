import React, { useState, useEffect } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const NutritionAnalytics = () => {
  const [period, setPeriod] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endpoint = period === 'day' ? '/analytics/daily' : '/analytics/weekly';
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <SectionHeader title="Analytics" subtitle="Loading your nutrition data..." />
        <AppCard style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          <p>Loading...</p>
        </AppCard>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <SectionHeader title="Analytics" subtitle="Error loading analytics" />
        <AppCard style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          <p style={{ color: theme.colors.danger }}>{error}</p>
          <AppButton onClick={fetchAnalytics}>Retry</AppButton>
        </AppCard>
      </PageContainer>
    );
  }

  // Mock data for now, will be replaced with real calculations
  const macroData = analyticsData ? [
    {
      label: 'Protein',
      current: period === 'day' ? (analyticsData.daily_summary?.total_protein || 0) : (analyticsData.weekly_summary?.avg_daily_protein || 0),
      target: 120,
      unit: 'g',
      color: theme.colors.secondary,
      icon: '💪'
    },
    {
      label: 'Carbohydrates',
      current: period === 'day' ? (analyticsData.daily_summary?.total_carbs || 0) : (analyticsData.weekly_summary?.avg_daily_carbs || 0),
      target: 275,
      unit: 'g',
      color: theme.colors.primary,
      icon: '🌾'
    },
    {
      label: 'Fat',
      current: period === 'day' ? (analyticsData.daily_summary?.total_fat || 0) : (analyticsData.weekly_summary?.avg_daily_fat || 0),
      target: 85,
      unit: 'g',
      color: '#F59E0B',
      icon: '🥑'
    },
  ] : [];

  const micronutrients = [
    { name: 'Vitamin C', value: '125%', status: 'Good', icon: '🍊' },
    { name: 'Iron', value: '85%', status: 'OK', icon: '🥩' },
    { name: 'Calcium', value: '72%', status: 'Low', icon: '🥛' },
    { name: 'Potassium', value: '92%', status: 'Good', icon: '🍌' },
    { name: 'Magnesium', value: '68%', status: 'Low', icon: '🥬' },
    { name: 'Zinc', value: '95%', status: 'Good', icon: '🦪' },
  ];

  const weeklyCalories = analyticsData && period === 'week' ?
    (analyticsData.daily_breakdown || []).map(day => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: day.total_calories,
      target: 2200,
    })) : [
      { day: 'Mon', calories: 2100, target: 2200 },
      { day: 'Tue', calories: 1950, target: 2200 },
      { day: 'Wed', calories: 2200, target: 2200 },
      { day: 'Thu', calories: 1850, target: 2200 },
      { day: 'Fri', calories: 2000, target: 2200 },
      { day: 'Sat', calories: 2300, target: 2200 },
      { day: 'Sun', calories: 1900, target: 2200 },
    ];

  return (
    <PageContainer>
      <SectionHeader
        title="Analytics"
        subtitle="Deep dive into your nutrition data and weekly trends."
      />

      {/* Period Selector */}
      <AppCard style={{ marginBottom: theme.spacing.xxl }}>
        <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
            View by:
          </h3>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            {['day', 'week'].map((p) => (
              <AppButton
                key={p}
                variant={period === p ? 'primary' : 'secondary'}
                onClick={() => setPeriod(p)}
                style={{ fontSize: '13px', height: '40px', padding: '0 16px', fontWeight: period === p ? 600 : 500 }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </AppButton>
            ))}
          </div>
        </div>
      </AppCard>

      {/* Macronutrients Section */}
      <div style={{ marginBottom: theme.spacing.xxl }}>
        <AppCard>
          <SectionHeader title="Daily Macronutrients" subtitle="Track protein, carbs, and fat intake" />
          <div style={{ display: 'grid', gap: theme.spacing.xl }}>
            {macroData.map((macro, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    <span style={{ fontSize: '20px' }}>{macro.icon}</span>
                    <span style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary }}>
                      {macro.label}
                    </span>
                  </div>
                  <span style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary }}>
                    {macro.current}{macro.unit} / {macro.target}{macro.unit}
                  </span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: theme.colors.border, borderRadius: '6px', overflow: 'hidden', marginBottom: theme.spacing.sm }}>
                  <div
                    style={{
                      width: `${Math.min((macro.current / macro.target) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: macro.color,
                      borderRadius: '6px',
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: theme.spacing.sm }}>
                  <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                    {Math.round((macro.current / macro.target) * 100)}% complete
                  </span>
                  <span style={{ ...theme.typography.small, color: macro.current < macro.target ? theme.colors.danger : theme.colors.secondary }}>
                    {Math.abs(macro.current - macro.target)}{macro.unit} {macro.current < macro.target ? 'to go' : 'over'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      {/* Calorie Trend Chart */}
      <div style={{ marginBottom: theme.spacing.xxl }}>
        <AppCard>
          <SectionHeader title="Calorie Trends" />
          <div>
            <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.lg }}>
              {period === 'week' ? '7-day' : 'Daily'} average: <strong style={{ color: theme.colors.textPrimary }}>
                {period === 'day' ? (analyticsData?.daily_summary?.total_calories || 0).toFixed(0) : (analyticsData?.weekly_summary?.avg_daily_calories || 0).toFixed(0)} calories
              </strong>
            </p>
            <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'end', height: '200px', marginBottom: theme.spacing.lg }}>
              {weeklyCalories.map((stat, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${(stat.calories / 2500) * 100}%`,
                        backgroundColor: stat.calories > stat.target ? theme.colors.danger : theme.colors.primary,
                        borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
                        transition: 'all 200ms ease',
                        cursor: 'pointer',
                        opacity: 0.8,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                      title={`${stat.day}: ${stat.calories} cal`}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-24px',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                    }}>
                      <span style={{ ...theme.typography.small, color: theme.colors.textSecondary, fontSize: '12px' }}>
                        {stat.day}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: theme.spacing.lg, marginTop: theme.spacing.xxl }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: theme.colors.primary, borderRadius: '2px' }} />
                <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>On Track</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: theme.colors.danger, borderRadius: '2px' }} />
                <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>Over Target</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      {/* Micronutrients Detailed Section */}
      <div style={{ marginBottom: theme.spacing.xxl }}>
        <AppCard>
          <SectionHeader title="Micronutrients" subtitle="Vitamins and minerals breakdown" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: theme.spacing.lg,
          }}>
            {micronutrients.map((nutrient, index) => (
              <div
                key={index}
                style={{
                  padding: theme.spacing.lg,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                  <span style={{ fontSize: '24px' }}>{nutrient.icon}</span>
                  <span style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary }}>
                    {nutrient.name}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0 }}>
                    {nutrient.value}
                  </p>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: nutrient.status === 'Good' ? theme.colors.secondary + '20' : nutrient.status === 'OK' ? theme.colors.primary + '20' : theme.colors.danger + '20',
                    color: nutrient.status === 'Good' ? theme.colors.secondary : nutrient.status === 'OK' ? theme.colors.primary : theme.colors.danger,
                    borderRadius: theme.borderRadius.md,
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {nutrient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      {/* Insights Card */}
      <AppCard>
        <SectionHeader title="Key Insights" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
          {[
            { icon: '📈', title: 'Protein Consistency', desc: 'You\'re 90% consistent with protein goals' },
            { icon: '💧', title: 'Hydration Needed', desc: 'Increase water by 16 oz daily for better results' },
            { icon: '🎯', title: 'Calorie Balance', desc: 'Average is 150 cal below target—safe deficit' },
          ].map((insight, index) => (
            <div
              key={index}
              style={{
                padding: theme.spacing.lg,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                gap: theme.spacing.md,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '24px', minWidth: '30px' }}>{insight.icon}</span>
              <div>
                <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                  {insight.title}
                </h4>
                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                  {insight.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AppCard>
    </PageContainer>
  );
};

export default NutritionAnalytics;
