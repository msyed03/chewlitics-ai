import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MealScanner = () => {
    const [mealDescription, setMealDescription] = useState('');
    const [mealType, setMealType] = useState('');
    const [parsedMeal, setParsedMeal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleParseMeal = async () => {
        if (!mealDescription.trim()) {
            setError('Please enter a meal description');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/nutrition/parse-meal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meal_description: mealDescription }),
            });

            if (!response.ok) {
                throw new Error('Failed to parse meal');
            }

            const data = await response.json();
            setParsedMeal(data);
        } catch (err) {
            const errorMsg = err.message || 'Error parsing meal. Make sure backend is running at http://localhost:8000';
            setError(errorMsg);
            console.error('Parse meal error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveMeal = async () => {
        if (!parsedMeal) return;

        setLoading(true);
        setError(null);

        try {
            const mealData = {
                original_description: mealDescription,
                parsed_ingredients: JSON.stringify(parsedMeal.ingredients),
                calories: parsedMeal.total_nutrition.calories,
                protein: parsedMeal.total_nutrition.protein,
                carbs: parsedMeal.total_nutrition.carbs,
                fat: parsedMeal.total_nutrition.fat,
                fiber: parsedMeal.total_nutrition.fiber || 0,
                meal_type: mealType || null,
                ingredients: parsedMeal.ingredients,
            };

            const response = await fetch(`${API_BASE_URL}/meals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mealData),
            });

            if (!response.ok) {
                throw new Error('Failed to save meal');
            }

            // Success
            setMealDescription('');
            setMealType('');
            setParsedMeal(null);
            setError(null);
            alert('Meal saved successfully!');
        } catch (err) {
            const errorMsg = err.message || 'Error saving meal. Make sure backend is running.';
            setError(errorMsg);
            console.error('Save meal error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMealDescription('');
        setMealType('');
        setParsedMeal(null);
        setError(null);
    };

    const handleMealTypeToggle = (type) => {
        setMealType(mealType === type ? '' : type);
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Log Your Meal"
            />

            {/* ===== MEAL TYPE SELECTOR ===== */}
            <div style={{ marginBottom: theme.spacing.xxl }}>
                <AppCard style={{ padding: theme.spacing.lg }}>
                    <div style={{ marginBottom: theme.spacing.md }}>
                        <h3 style={{
                            ...theme.typography.body,
                            fontWeight: 600,
                            color: theme.colors.textPrimary,
                            margin: 0,
                            marginBottom: theme.spacing.sm,
                        }}>
                            🍽️ Meal Type (Optional)
                        </h3>
                        <p style={{
                            ...theme.typography.small,
                            color: theme.colors.textSecondary,
                            margin: 0,
                        }}>
                            Select the type of meal you're logging
                        </p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: theme.spacing.md,
                    }}>
                        {[
                            { value: 'breakfast', label: 'Breakfast', icon: '🥣' },
                            { value: 'lunch', label: 'Lunch', icon: '🥗' },
                            { value: 'dinner', label: 'Dinner', icon: '🍽️' },
                            { value: 'snack', label: 'Snack', icon: '🍿' },
                        ].map((type) => (
                            <AppButton
                                key={type.value}
                                variant={mealType === type.value ? 'primary' : 'secondary'}
                                onClick={() => handleMealTypeToggle(type.value)}
                                style={{
                                    height: '60px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: theme.spacing.xs,
                                    fontSize: '12px',
                                    fontWeight: mealType === type.value ? 600 : 500,
                                    border: mealType === type.value ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>{type.icon}</span>
                                {type.label}
                            </AppButton>
                        ))}
                    </div>
                </AppCard>
            </div>

            {/* ===== DESCRIBE YOUR MEAL SECTION ===== */}
            <div style={{ marginBottom: theme.spacing.xxl }}>
                <AppCard style={{
                    padding: theme.spacing.xl,
                    background: `linear-gradient(135deg, ${theme.colors.secondary}10, ${theme.colors.primary}10)`,
                    border: `2px solid ${theme.colors.secondary}`,
                }}>
                    <div style={{ marginBottom: theme.spacing.lg }}>
                        <h2 style={{
                            ...theme.typography.sectionHeading,
                            color: theme.colors.textPrimary,
                            marginBottom: theme.spacing.sm,
                        }}>
                            📝 Describe Your Meal
                        </h2>
                        <p style={{
                            ...theme.typography.body,
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.lg,
                        }}>
                            Use natural language to describe what you ate. Be as specific or casual as you like!
                        </p>
                    </div>

                    <textarea
                        value={mealDescription}
                        onChange={(e) => setMealDescription(e.target.value)}
                        placeholder="e.g. I ate 2 eggs, 1 toast with butter, 1 apple, and a cup of coffee with milk"
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: theme.spacing.md,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: theme.spacing.lg,
                        }}
                    />

                    {error && (
                        <div style={{
                            padding: theme.spacing.md,
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.lg,
                            fontSize: '13px',
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: theme.spacing.md }}>
                        <AppButton
                            onClick={handleParseMeal}
                            disabled={loading || !mealDescription.trim()}
                            style={{ flex: 1 }}
                        >
                            {loading ? '⏳ Analyzing...' : '🔍 Analyze Meal'}
                        </AppButton>
                        <AppButton
                            variant="secondary"
                            onClick={handleReset}
                            style={{ flex: 1 }}
                        >
                            Clear
                        </AppButton>
                    </div>
                </AppCard>
            </div>

            {/* ===== PARSED MEAL RESULTS ===== */}
            {parsedMeal && (
                <div style={{ marginBottom: theme.spacing.xxl }}>
                    <AppCard style={{
                        background: `linear-gradient(135deg, ${theme.colors.secondary}10, ${theme.colors.primary}10)`,
                        padding: theme.spacing.xl,
                    }}>
                        <div style={{ marginBottom: theme.spacing.lg }}>
                            <h3 style={{
                                ...theme.typography.sectionHeading,
                                color: theme.colors.secondary,
                                margin: 0,
                            }}>
                                ✅ Analysis Complete
                            </h3>
                        </div>

                        {/* Ingredients Breakdown */}
                        <div style={{ marginBottom: theme.spacing.xl }}>
                            <h4 style={{
                                ...theme.typography.body,
                                fontWeight: 600,
                                color: theme.colors.textPrimary,
                                margin: 0,
                                marginBottom: theme.spacing.md,
                            }}>
                                Ingredients Found:
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                                {parsedMeal.ingredients.map((ing, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: theme.spacing.md,
                                            backgroundColor: theme.colors.surface,
                                            border: `1px solid ${theme.colors.border}`,
                                            borderRadius: theme.borderRadius.md,
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
                                            <h5 style={{
                                                ...theme.typography.body,
                                                fontWeight: 600,
                                                color: theme.colors.textPrimary,
                                                margin: 0,
                                            }}>
                                                {ing.ingredient_name.charAt(0).toUpperCase() + ing.ingredient_name.slice(1)}
                                            </h5>
                                            <span style={{
                                                ...theme.typography.small,
                                                fontWeight: 600,
                                                color: theme.colors.primary,
                                            }}>
                                                {ing.quantity} {ing.unit}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: theme.spacing.md,
                                        }}>
                                            <div style={{ textAlign: 'center', padding: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                                                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>Cal</p>
                                                <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.primary, margin: 0 }}>
                                                    {ing.calories.toFixed(0)}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center', padding: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                                                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>Protein</p>
                                                <p style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.secondary, margin: 0 }}>
                                                    {ing.protein.toFixed(1)}g
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center', padding: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                                                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>Carbs</p>
                                                <p style={{ ...theme.typography.body, fontWeight: 600, color: '#F59E0B', margin: 0 }}>
                                                    {ing.carbs.toFixed(1)}g
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'center', padding: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                                                <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>Fat</p>
                                                <p style={{ ...theme.typography.body, fontWeight: 600, color: '#3B82F6', margin: 0 }}>
                                                    {ing.fat.toFixed(1)}g
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total Nutrition */}
                        <div style={{
                            padding: theme.spacing.lg,
                            backgroundColor: theme.colors.background,
                            borderRadius: theme.borderRadius.lg,
                            marginBottom: theme.spacing.lg,
                        }}>
                            <h4 style={{
                                ...theme.typography.body,
                                fontWeight: 600,
                                color: theme.colors.textPrimary,
                                margin: 0,
                                marginBottom: theme.spacing.lg,
                            }}>
                                Total Nutrition:
                            </h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: theme.spacing.md,
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        Calories
                                    </p>
                                    <p style={{ ...theme.typography.sectionHeading, color: theme.colors.primary, margin: 0 }}>
                                        {parsedMeal.total_nutrition.calories.toFixed(0)}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        Protein
                                    </p>
                                    <p style={{ ...theme.typography.sectionHeading, color: theme.colors.secondary, margin: 0 }}>
                                        {parsedMeal.total_nutrition.protein.toFixed(1)}g
                                    </p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        Carbs
                                    </p>
                                    <p style={{ ...theme.typography.sectionHeading, color: '#F59E0B', margin: 0 }}>
                                        {parsedMeal.total_nutrition.carbs.toFixed(1)}g
                                    </p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        Fat
                                    </p>
                                    <p style={{ ...theme.typography.sectionHeading, color: '#3B82F6', margin: 0 }}>
                                        {parsedMeal.total_nutrition.fat.toFixed(1)}g
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: theme.spacing.md }}>
                            <AppButton
                                onClick={handleSaveMeal}
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? '💾 Saving...' : '✅ Save Meal'}
                            </AppButton>
                            <AppButton
                                variant="secondary"
                                onClick={() => setParsedMeal(null)}
                                style={{ flex: 1 }}
                            >
                                🔄 Back to Input
                            </AppButton>
                        </div>
                    </AppCard>
                </div>
            )}

            {/* ===== DIVIDER ===== */}
            {!parsedMeal && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.lg,
                    marginBottom: theme.spacing.xxl,
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
                    <span style={{ color: theme.colors.textSecondary, fontSize: '14px', fontWeight: 600 }}>
                        OR
                    </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
                </div>
            )}

            {/* ===== AI PHOTO SCAN - COMING SOON ===== */}
            <div style={{ marginBottom: theme.spacing.xxl }}>
                <AppCard style={{
                    padding: theme.spacing.xxl,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.secondary}08)`,
                    opacity: 0.7,
                    border: `2px dashed ${theme.colors.border}`,
                }}>
                    <div style={{ marginBottom: theme.spacing.lg }}>
                        <div style={{
                            fontSize: '80px',
                            marginBottom: theme.spacing.md,
                            opacity: 0.5,
                        }}>
                            📸
                        </div>
                        <h2 style={{
                            ...theme.typography.sectionHeading,
                            color: theme.colors.textPrimary,
                            marginBottom: theme.spacing.sm,
                        }}>
                            AI Photo Scan
                        </h2>
                        <p style={{
                            ...theme.typography.body,
                            color: theme.colors.textSecondary,
                            maxWidth: '500px',
                            margin: `0 auto ${theme.spacing.lg}`,
                        }}>
                            Coming Soon – Take a photo of your meal and our AI will automatically identify ingredients and nutrition.
                        </p>
                        <div style={{
                            display: 'inline-block',
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            backgroundColor: theme.colors.primary + '20',
                            color: theme.colors.primary,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '12px',
                            fontWeight: 600,
                            marginTop: theme.spacing.md,
                        }}>
                            🔴 Coming Soon
                        </div>
                    </div>
                </AppCard>
            </div>

            {/* ===== HOW IT WORKS ===== */}
            <AppCard style={{ marginBottom: theme.spacing.xxl }}>
                <SectionHeader title="How Text-Based Logging Works" />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: theme.spacing.xl,
                }}>
                    {[
                        { step: 1, title: 'Describe Your Meal', desc: 'Write what you ate naturally, as if telling a friend.', icon: '📝' },
                        { step: 2, title: 'AI Parsing', desc: 'Our system analyzes text and extracts ingredients.', icon: '🧠' },
                        { step: 3, title: 'Nutrition Lookup', desc: 'Each ingredient gets matched to nutrition data.', icon: '📊' },
                        { step: 4, title: 'Auto-Log', desc: 'Save the meal and track it instantly.', icon: '✅' },
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

            {/* ===== EXAMPLE INPUTS ===== */}
            <AppCard>
                <SectionHeader
                    title="Example Inputs"
                    subtitle="Try describing your meals like this"
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.lg }}>
                    {[
                        'I ate 2 eggs, 1 toast with butter, and coffee with milk',
                        '4 egg whites, 1 cup noodles with olives and mushrooms, 1 spoon honey',
                        'Grilled chicken breast, 1.5 cups rice, broccoli, and 1 tbsp olive oil',
                        'Tuna sandwich with lettuce, 1 apple, and almonds',
                    ].map((example, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: theme.spacing.lg,
                                backgroundColor: theme.colors.background,
                                borderRadius: theme.borderRadius.lg,
                                border: `1px solid ${theme.colors.border}`,
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                            }}
                            onClick={() => setMealDescription(example)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.primary + '10';
                                e.currentTarget.style.borderColor = theme.colors.primary;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.background;
                                e.currentTarget.style.borderColor = theme.colors.border;
                            }}
                        >
                            <p style={{
                                ...theme.typography.small,
                                color: theme.colors.textSecondary,
                                margin: 0,
                                fontStyle: 'italic',
                            }}>
                                {example}
                            </p>
                        </div>
                    ))}
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default MealScanner;
