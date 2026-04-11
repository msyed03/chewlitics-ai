import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const Dashboard = () => {
  return (
    <PageContainer>
      {/* Hero Welcome Section */}
      <AppCard style={{
        background: theme.gradients.primaryAlt,
        color: 'white',
        padding: `${theme.spacing.xxl} ${theme.spacing.xxl}`,
        marginBottom: theme.spacing.xxl,
        boxShadow: theme.shadows.hero,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '@media (max-width: 768px)': { flexDirection: 'column' } }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '36px', fontWeight: 700, margin: 0, marginBottom: theme.spacing.sm }}>
              Welcome back, Alex! 👋
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.95, margin: 0, marginBottom: theme.spacing.lg }}>
              You're on track today. 1,850 / 2,200 calories logged.
            </p>
            <Link to="/meal-scanner" style={{ textDecoration: 'none' }}>
              <AppButton style={{
                backgroundColor: 'white',
                color: theme.colors.primary,
                fontWeight: 600,
              }}>
                📸 Scan New Meal
              </AppButton>
            </Link>
          </div>
          <div style={{ fontSize: '120px', opacity: 0.1, textAlign: 'right' }}>🤖</div>
        </div>
      </AppCard>

      {/* AI Summary Card */}
      <AppCard style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
        border: `2px solid ${theme.colors.primary}`,
        padding: theme.spacing.xxl,
        marginBottom: theme.spacing.xxl,
      }}>
        <div style={{ display: 'flex', gap: theme.spacing.lg, alignItems: 'flex-start' }}>
          <div style={{
            fontSize: '32px',
            minWidth: '50px',
          }}>
            ✨
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ ...theme.typography.sectionHeading, color: theme.colors.primary, margin: 0, marginBottom: theme.spacing.md, fontWeight: 700 }}>
              AI Insight for Today
            </h3>
            <p style={{ ...theme.typography.body, color: theme.colors.textPrimary, margin: 0, lineHeight: '1.6' }}>
              Your meals today show consistent macronutrient balance. The AI detected a great variety of protein sources (chicken, shake, tofu) which supports muscle recovery. Keep hydration steady—you're 2 glasses of water behind today's target. 💧
            </p>
            <Link to="/ai-coach">
              <AppButton variant="secondary" style={{ marginTop: theme.spacing.lg }}>
                💬 Chat with AI Coach
              </AppButton>
            </Link>
          </div>
        </div>
      </AppCard>

      {/* Main Grid: Today's Meals + Goals Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.xxl,
        marginBottom: theme.spacing.xxl,
        '@media (max-width: 1024px)': {
          gridTemplateColumns: '1fr',
        },
      }}>
        {/* Today's Meals Timeline */}
        <AppCard>
          <SectionHeader title="Today's Meals" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            {[
              { time: '8:00 AM', meal: 'Protein Shake', cal: 250, icon: '🥤' },
              { time: '12:30 PM', meal: 'Grilled Chicken Salad', cal: 450, icon: '🥗' },
              { time: '4:00 PM', meal: 'Apple & Almonds', cal: 200, icon: '🍎' },
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: theme.spacing.md,
                alignItems: 'center',
                paddingBottom: index < 2 ? theme.spacing.lg : 0,
                borderBottom: index < 2 ? `1px solid ${theme.colors.border}` : 'none',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.background,
                  fontSize: '24px',
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                    {item.meal}
                  </p>
                  <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                    {item.time}
                  </p>
                </div>
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: theme.colors.secondary + '20',
                  color: theme.colors.secondary,
                  borderRadius: theme.borderRadius.md,
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  {item.cal} cal
                </div>
              </div>
            ))}
            <div style={{
              paddingTop: theme.spacing.lg,
              borderTop: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary }}>
                Total: 900 cal
              </span>
              <Link to="/meal-history" style={{ textDecoration: 'none' }}>
                <AppButton variant="secondary" style={{ fontSize: '13px', padding: '8px 12px', height: 'auto' }}>
                  View All →
                </AppButton>
              </Link>
            </div>
          </div>
        </AppCard>

        {/* Goal Progress Section */}
        <AppCard>
          <SectionHeader title="Daily Progress" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
            {[
              { label: 'Calories', current: 1850, target: 2200, color: theme.colors.primary },
              { label: 'Protein', current: 85, target: 120, color: theme.colors.secondary },
              { label: 'Water', current: 6, target: 8, color: '#3B82F6' },
            ].map((goal, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <span style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary }}>
                    {goal.label}
                  </span>
                  <span style={{ ...theme.typography.body, fontWeight: 600, color: goal.color }}>
                    {goal.current} {goal.label === 'Water' ? 'glasses' : goal.label === 'Protein' ? 'g' : 'cal'}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: theme.colors.border,
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: goal.color,
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing.xs,
                }}>
                  <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                    {Math.round((goal.current / goal.target) * 100)}% complete
                  </span>
                  <span style={{ ...theme.typography.small, color: theme.colors.textSecondary }}>
                    {goal.target - goal.current} to go
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      {/* Smart Insights Feed */}
      <div style={{ marginBottom: theme.spacing.xxl }}>
        <SectionHeader title="Smart Insights" subtitle="AI-generated trends and recommendations" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: theme.spacing.lg,
        }}>
          {[
            {
              icon: '📈',
              title: 'Consistency Streak',
              description: 'You\'ve logged meals for 7 consecutive days. Amazing dedication!',
              type: 'positive',
            },
            {
              icon: '⚠️',
              title: 'Hydration Alert',
              description: 'Your water intake is 25% below target. Make sure to hydrate throughout the day.',
              type: 'warning',
            },
            {
              icon: '🎯',
              title: 'Macro Optimization',
              description: 'Consider adding more complex carbs to stabilize energy levels for long workouts.',
              type: 'suggestion',
            },
            {
              icon: '✨',
              title: 'Eating Pattern',
              description: 'AI detected you eat larger meals in the evening. This could impact sleep quality.',
              type: 'suggestion',
            },
          ].map((insight, index) => (
            <AppCard key={index} style={{
              borderLeft: `4px solid ${insight.type === 'positive' ? theme.colors.secondary : insight.type === 'warning' ? theme.colors.danger : theme.colors.primary}`,
            }}>
              <div style={{ display: 'flex', gap: theme.spacing.lg }}>
                <div style={{ fontSize: '28px' }}>{insight.icon}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                    {insight.title}
                  </h4>
                  <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </AppCard>
          ))}
        </div>
      </div>

      {/* Suggested Recipes Card */}
      <AppCard>
        <SectionHeader title="Suggested Recipes" subtitle="Based on your nutrition patterns" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: theme.spacing.lg,
        }}>
          {[
            { name: 'High-Protein Bowl', cal: 520, protein: 45, icon: '🥣' },
            { name: 'Salmon Quinoa', cal: 620, protein: 48, icon: '🍣' },
            { name: 'Veggie Stir-Fry', cal: 450, protein: 32, icon: '🥦' },
          ].map((recipe, index) => (
            <div
              key={index}
              style={{
                padding: theme.spacing.lg,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
                  {recipe.name}
                </h4>
                <span style={{ fontSize: '24px' }}>{recipe.icon}</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: theme.spacing.sm,
                marginTop: theme.spacing.sm,
              }}>
                <div>
                  <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                    Calories
                  </p>
                  <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
                    {recipe.cal}
                  </p>
                </div>
                <div>
                  <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                    Protein
                  </p>
                  <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
                    {recipe.protein}g
                  </p>
                </div>
              </div>
              <Link to="/recipe-generator" style={{ textDecoration: 'none' }}>
                <AppButton variant="secondary" style={{ width: '100%', fontSize: '13px', height: '40px' }}>
                  View Recipe →
                </AppButton>
              </Link>
            </div>
          ))}
        </div>
      </AppCard>
    </PageContainer>
  );
};

export default Dashboard;