import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const RecipeGenerator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [savedRecipes, setSavedRecipes] = useState([]);

  const recipes = [
    {
      id: 1,
      name: 'High-Protein Breakfast Bowl',
      description: 'Greek yogurt, granola, berries, and honey',
      calories: 380,
      protein: 22,
      type: 'breakfast',
      macroMatch: 'Perfect for your goals',
      icon: '🥣',
    },
    {
      id: 2,
      name: 'Salmon & Quinoa Power Bowl',
      description: 'Grilled salmon, quinoa, roasted vegetables, olive oil',
      calories: 620,
      protein: 45,
      type: 'lunch',
      macroMatch: 'Great balance',
      icon: '🍣',
    },
    {
      id: 3,
      name: 'Chicken Stir-Fry',
      description: 'Lean chicken breast, mixed vegetables, brown rice',
      calories: 520,
      protein: 48,
      type: 'dinner',
      macroMatch: 'High protein',
      icon: '🍗',
    },
    {
      id: 4,
      name: 'Mediterranean Salad',
      description: 'Chickpeas, cucumber, tomato, feta, olive oil dressing',
      calories: 420,
      protein: 18,
      type: 'lunch',
      macroMatch: 'Balanced',
      icon: '🥗',
    },
    {
      id: 5,
      name: 'Protein Smoothie Bowl',
      description: 'Blend: protein powder, almond milk, banana, berries',
      calories: 340,
      protein: 32,
      type: 'breakfast',
      macroMatch: 'Light & filling',
      icon: '🍓',
    },
    {
      id: 6,
      name: 'Turkey Tacos',
      description: 'Lean ground turkey, whole wheat tortillas, toppings',
      calories: 480,
      protein: 42,
      type: 'dinner',
      macroMatch: 'High protein',
      icon: '🌮',
    },
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || recipe.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleSaveRecipe = (recipeId) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Recipe Generator"
        subtitle="AI-generated recipes tailored to your nutrition goals"
      />

      {/* Generator CTA */}
      <div style={{ marginBottom: theme.spacing.xxl }}>
        <AppCard style={{
          padding: theme.spacing.xxl,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.colors.secondary}15, ${theme.colors.primary}15)`,
          border: `2px dashed ${theme.colors.secondary}`,
        }}>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{ fontSize: '64px', marginBottom: theme.spacing.md }}>🍳</div>
            <h2 style={{
              ...theme.typography.sectionHeading,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}>
              Generate Custom Recipe
            </h2>
            <p style={{
              ...theme.typography.body,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
            }}>
              Tell the AI what you're craving and your nutritional preferences, and get personalized recipes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            <AppButton>✨ Generate Recipe</AppButton>
            <AppButton variant="secondary">🔖 Saved ({savedRecipes.length})</AppButton>
          </div>
        </AppCard>
      </div>

      {/* Search & Filter */}
      <AppCard style={{ marginBottom: theme.spacing.xxl }}>
        <div style={{ display: 'grid', gap: theme.spacing.md }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes (e.g., 'salmon', 'quick', 'vegetarian')..."
            style={{
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.lg,
              ...theme.typography.body,
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="all"
                checked={filterType === 'all'}
                onChange={() => setFilterType('all')}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>All Meals</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="breakfast"
                checked={filterType === 'breakfast'}
                onChange={() => setFilterType('breakfast')}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🌅 Breakfast</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="lunch"
                checked={filterType === 'lunch'}
                onChange={() => setFilterType('lunch')}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🌤️ Lunch</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
              <input
                type="radio"
                name="type"
                value="dinner"
                checked={filterType === 'dinner'}
                onChange={() => setFilterType('dinner')}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>🌙 Dinner</span>
            </label>
          </div>
        </div>
      </AppCard>

      {/* Recipe Count */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
          Found <strong>{filteredRecipes.length}</strong> recipe{filteredRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipes Grid */}
      <SectionHeader title="Recommended Recipes" subtitle="Based on your nutrition goals and preferences" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xxl,
      }}>
        {filteredRecipes.map((recipe) => (
          <AppCard
            key={recipe.id}
            style={{
              transition: 'all 200ms ease',
              borderLeft: savedRecipes.includes(recipe.id) ? `4px solid ${theme.colors.secondary}` : '4px solid transparent',
              backgroundColor: savedRecipes.includes(recipe.id) ? theme.colors.secondary + '08' : theme.colors.surface,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.card;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ marginBottom: theme.spacing.lg }}>
              <div style={{
                fontSize: '48px',
                marginBottom: theme.spacing.md,
              }}>
                {recipe.icon}
              </div>
              <h3 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.md }}>
                {recipe.name}
              </h3>
              <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.lg, fontSize: '14px' }}>
                {recipe.description}
              </p>
            </div>

            <div style={{
              padding: theme.spacing.lg,
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.lg,
              marginBottom: theme.spacing.lg,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                <div>
                  <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0, fontSize: '12px', marginBottom: theme.spacing.xs }}>
                    Calories
                  </p>
                  <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
                    {recipe.calories} cal
                  </p>
                </div>
                <div>
                  <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0, fontSize: '12px', marginBottom: theme.spacing.xs }}>
                    Protein
                  </p>
                  <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>
                    {recipe.protein}g
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: theme.spacing.lg }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: theme.colors.secondary + '20',
                color: theme.colors.secondary,
                borderRadius: theme.borderRadius.md,
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {recipe.macroMatch}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
              <AppButton variant="secondary">📖 View Recipe</AppButton>
              <AppButton 
                onClick={() => toggleSaveRecipe(recipe.id)}
                style={{
                  backgroundColor: savedRecipes.includes(recipe.id) ? theme.colors.secondary : undefined,
                  color: savedRecipes.includes(recipe.id) ? 'white' : undefined,
                }}
              >
                {savedRecipes.includes(recipe.id) ? '✅ Saved' : '🔖 Save'}
              </AppButton>
            </div>
          </AppCard>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <AppCard style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          <p style={{ ...theme.typography.body, color: theme.colors.textSecondary, margin: 0 }}>
            No recipes found matching your criteria. Try different search terms or filters.
          </p>
        </AppCard>
      )}
    </PageContainer>
  );
};

export default RecipeGenerator;