import React from 'react';
import { Link } from 'react-router-dom';
import AppButton from '../components/ui/AppButton';
import AppCard from '../components/ui/AppCard';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import { routePaths } from '../constants/routes';
import { theme } from '../constants/theme';

const stats = [
  { label: 'Calories logged', value: '1,850', detail: '84% of target', color: theme.colors.primary },
  { label: 'Protein', value: '85g', detail: '35g to goal', color: theme.colors.success },
  { label: 'Hydration', value: '6 cups', detail: '2 cups behind', color: theme.colors.accent },
];

const meals = [
  { time: '8:00 AM', meal: 'Protein shake', cal: 250 },
  { time: '12:30 PM', meal: 'Grilled chicken salad', cal: 450 },
  { time: '4:00 PM', meal: 'Apple and almonds', cal: 200 },
];

const insights = [
  {
    title: 'Protein pacing looks strong',
    description: 'You spread protein across three meals, which supports steadier energy and recovery.',
    tone: theme.colors.success,
  },
  {
    title: 'Hydration is your easiest win',
    description: 'Adding two glasses of water this evening would bring today back on target.',
    tone: theme.colors.accent,
  },
  {
    title: 'Dinner can stay lighter',
    description: 'Recent patterns show better sleep on days when your final meal lands under 600 calories.',
    tone: theme.colors.primary,
  },
];

const recipes = [
  { name: 'High-protein quinoa bowl', calories: 520, protein: 42 },
  { name: 'Salmon citrus plate', calories: 610, protein: 47 },
  { name: 'Veggie tofu stir-fry', calories: 440, protein: 31 },
];

const Dashboard = () => {
  return (
    <PageContainer>
      <AppCard
        style={{
          background: theme.gradients.primary,
          color: '#FFFFFF',
          marginBottom: theme.spacing.xl,
          boxShadow: theme.shadows.hero,
        }}
      >
        <div className="dashboard-hero">
          <div>
            <p className="eyebrow-text" style={{ color: 'rgba(255, 255, 255, 0.78)', marginBottom: theme.spacing.sm }}>
              Daily overview
            </p>
            <h1 style={{ ...theme.typography.heroHeading, margin: 0, marginBottom: theme.spacing.sm }}>
              Good momentum today, Alex.
            </h1>
            <p style={{ margin: 0, maxWidth: '560px', opacity: 0.92, fontSize: '15px' }}>
              You are tracking close to target, protein quality is solid, and there is room for one more balanced meal.
            </p>
          </div>
          <Link to={routePaths.scanMeal} style={{ textDecoration: 'none' }}>
            <AppButton
              variant="secondary"
              style={{ backgroundColor: '#FFFFFF', color: theme.colors.primary, borderColor: 'transparent' }}
            >
              Scan Meal
            </AppButton>
          </Link>
        </div>
      </AppCard>

      <div className="stats-grid" style={{ marginBottom: theme.spacing.xl }}>
        {stats.map((stat) => (
          <AppCard key={stat.label} style={{ padding: theme.spacing.lg }}>
            <p className="eyebrow-text" style={{ marginBottom: theme.spacing.sm }}>{stat.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing.sm }}>
              <h2 style={{ margin: 0, color: stat.color, fontSize: '28px' }}>{stat.value}</h2>
              <span style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>{stat.detail}</span>
            </div>
          </AppCard>
        ))}
      </div>

      <div className="dashboard-main-grid" style={{ marginBottom: theme.spacing.xl }}>
        <AppCard>
          <SectionHeader title="Today’s meals" subtitle="Fast view of what is already logged" />
          <div style={{ display: 'grid', gap: theme.spacing.md }}>
            {meals.map((item) => (
              <div key={item.time} className="list-row">
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: theme.colors.textPrimary }}>{item.meal}</p>
                  <p style={{ margin: `${theme.spacing.xs} 0 0`, color: theme.colors.textSecondary, fontSize: '12px' }}>
                    {item.time}
                  </p>
                </div>
                <span className="pill pill-soft">{item.cal} cal</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: theme.spacing.lg }}>
            <Link to={routePaths.mealHistory} style={{ textDecoration: 'none' }}>
              <AppButton variant="ghost" style={{ paddingLeft: 0 }}>
                View meal history
              </AppButton>
            </Link>
          </div>
        </AppCard>

        <AppCard>
          <SectionHeader title="Recommended focus" subtitle="MVP insights replacing the old coach flow" />
          <div style={{ display: 'grid', gap: theme.spacing.md }}>
            {insights.map((insight) => (
              <div
                key={insight.title}
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.lg,
                  borderLeft: `4px solid ${insight.tone}`,
                }}
              >
                <p style={{ margin: 0, fontWeight: 600, color: theme.colors.textPrimary }}>{insight.title}</p>
                <p style={{ margin: `${theme.spacing.xs} 0 0`, color: theme.colors.textSecondary }}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      <AppCard>
        <SectionHeader title="Recipe suggestions" subtitle="Quick picks matched to your recent patterns" />
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.name} className="surface-panel">
              <p style={{ margin: 0, fontWeight: 600, color: theme.colors.textPrimary }}>{recipe.name}</p>
              <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.sm, color: theme.colors.textSecondary, fontSize: '12px' }}>
                <span>{recipe.calories} cal</span>
                <span>{recipe.protein}g protein</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: theme.spacing.lg }}>
          <Link to={routePaths.recipes} style={{ textDecoration: 'none' }}>
            <AppButton variant="secondary">Browse recipes</AppButton>
          </Link>
        </div>
      </AppCard>
    </PageContainer>
  );
};

export default Dashboard;
