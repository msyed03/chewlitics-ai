import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const MealScanner = () => {
  const [scannedMeal, setScannedMeal] = useState(null);
  
  const handleScan = () => {
    setScannedMeal({
      name: 'Grilled Chicken with Roasted Vegetables',
      confidence: 98,
      calories: 520,
      protein: 45,
      carbs: 28,
      fat: 18,
      ingredients: ['Chicken Breast', 'Broccoli', 'Carrots', 'Olive Oil']
    });
  };

  const recentScans = [
    { name: 'Grilled Chicken with Vegetables', date: 'Today 12:30 PM', confidence: 98, icon: '🍗' },
    { name: 'Protein Shake', date: 'Today 8:00 AM', confidence: 95, icon: '🥤' },
    { name: 'Salad Bowl', date: 'Yesterday 1:15 PM', confidence: 92, icon: '🥗' },
    { name: 'Oatmeal with Berries', date: 'Yesterday 7:45 AM', confidence: 94, icon: '🥣' },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Meal Scanner"
        subtitle="Use AI to scan, analyze, and log your meals instantly."
      />

      {/* Main Scan Area */}
      <div style={{ marginBottom: theme.spacing.xxl }}>
        <AppCard style={{
          padding: theme.spacing.xxl,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.secondary}15)`,
          border: `2px dashed ${theme.colors.primary}`,
        }}>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{
              fontSize: '80px',
              marginBottom: theme.spacing.md,
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              📸
            </div>
            <h2 style={{
              ...theme.typography.sectionHeading,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}>
              Point & Analyze
            </h2>
            <p style={{
              ...theme.typography.body,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
              maxWidth: '500px',
              margin: '0 auto',
              marginBottom: theme.spacing.lg,
            }}>
              Take a photo of your meal and our AI will instantly identify ingredients, estimate calories, and break down macronutrients.
            </p>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            <AppButton onClick={handleScan} style={{ fontSize: '16px', fontWeight: 600 }}>
              📷 Scan Meal
            </AppButton>
            <AppButton variant="secondary">📁 Upload Photo</AppButton>
          </div>
        </AppCard>
      </div>

      {/* Scanned Meal Result */}
      {scannedMeal && (
        <AppCard style={{ marginBottom: theme.spacing.xxl, background: `linear-gradient(135deg, ${theme.colors.secondary}10, ${theme.colors.primary}10)` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
            <h3 style={{ ...theme.typography.sectionHeading, color: theme.colors.textPrimary, margin: 0 }}>
              ✅ Analysis Complete
            </h3>
            <span style={{
              padding: '4px 12px',
              backgroundColor: theme.colors.secondary + '30',
              color: theme.colors.secondary,
              borderRadius: theme.borderRadius.md,
              fontWeight: 600,
              fontSize: '13px',
            }}>
              {scannedMeal.confidence}% Confidence
            </span>
          </div>
          <AppCard style={{ marginBottom: theme.spacing.lg, boxShadow: 'none', border: 'none' }}>
            <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.lg }}>
              {scannedMeal.name}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <div style={{ textAlign: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                  Calories
                </p>
                <p style={{ ...theme.typography.sectionHeading, color: theme.colors.primary, margin: 0 }}>
                  {scannedMeal.calories}
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                  Protein
                </p>
                <p style={{ ...theme.typography.sectionHeading, color: theme.colors.secondary, margin: 0 }}>
                  {scannedMeal.protein}g
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                  Carbs
                </p>
                <p style={{ ...theme.typography.sectionHeading, color: '#F59E0B', margin: 0 }}>
                  {scannedMeal.carbs}g
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg }}>
                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                  Fat
                </p>
                <p style={{ ...theme.typography.sectionHeading, color: '#3B82F6', margin: 0 }}>
                  {scannedMeal.fat}g
                </p>
              </div>
            </div>
            <div>
              <h5 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.md }}>
                Detected Ingredients:
              </h5>
              <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                {scannedMeal.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: theme.colors.border,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </AppCard>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <AppButton style={{ flex: 1 }}>✅ Log This Meal</AppButton>
            <AppButton variant="secondary" style={{ flex: 1 }}>🔄 Rescan</AppButton>
            <AppButton variant="secondary" style={{ flex: 1 }}>✏️ Edit Details</AppButton>
          </div>
        </AppCard>
      )}

      {/* How It Works */}
      <AppCard style={{ marginBottom: theme.spacing.xxl }}>
        <SectionHeader title="How It Works" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme.spacing.xl,
        }}>
          {[
            { step: 1, title: 'Snap a Photo', desc: 'Point your camera at your meal from above.', icon: '📸' },
            { step: 2, title: 'AI Analysis', desc: 'Our AI identifies ingredients & macros instantly.', icon: '🤖' },
            { step: 3, title: 'Review & Adjust', desc: 'Fine-tune portions and nutrient data as needed.', icon: '✏️' },
            { step: 4, title: 'Auto-Log', desc: 'Meal is logged to your nutrition tracker.', icon: '✅' },
          ].map((item) => (
            <div key={item.step}>
              <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.md, alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '24px',
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                    {item.title}
                  </h4>
                  <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      {/* Recent Scans */}
      <AppCard>
        <SectionHeader title="Recent Scans" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          {recentScans.map((scan, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: theme.spacing.lg,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg, flex: 1 }}>
                <div style={{ fontSize: '32px' }}>{scan.icon}</div>
                <div>
                  <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                    {scan.name}
                  </h4>
                  <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                    {scan.date}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.secondary + '20',
                  color: theme.colors.secondary,
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}>
                  {scan.confidence}%
                </div>
                <span style={{ fontSize: '20px', color: theme.colors.textSecondary }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>
    </PageContainer>
  );
};

export default MealScanner;