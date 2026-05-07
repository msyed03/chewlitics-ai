import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const macroItems = [
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
];

const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🥣' },
    { value: 'lunch', label: 'Lunch', icon: '🥗' },
    { value: 'dinner', label: 'Dinner', icon: '🍽️' },
    { value: 'snack', label: 'Snack', icon: '🍿' },
];

const examples = [
    'I ate 2 eggs, 1 toast with butter, 1 apple, and a cup of coffee with milk',
    '4 egg whites, 1 cup noodles with olives and mushrooms, 1 spoon honey',
    'Grilled chicken breast, 1.5 cups rice, broccoli, and 1 tbsp olive oil',
    'A burrito with steak, rice, beans, cheese, guacamole, salsa, and sour cream',
];

const MealScanner = () => {
    const [mealDescription, setMealDescription] = useState('');
    const [mealType, setMealType] = useState('');
    const [parsedMeal, setParsedMeal] = useState(null);
    const [imageScanResult, setImageScanResult] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleParseMeal = async () => {
        if (!mealDescription.trim()) {
            setError('Please enter a meal description');
            return;
        }

        setLoading(true);
        setError(null);
        setImageScanResult(null);

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
            setError(err.message || 'Error parsing meal. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        setSelectedImage(file || null);
        setImageScanResult(null);
        setError(null);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleScanImage = async () => {
        if (!selectedImage) {
            setError('Please choose a meal image first');
            return;
        }

        setImageLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedImage);

            const response = await fetch(`${API_BASE_URL}/vision/scan-meal`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to scan image');
            }

            const data = await response.json();
            setImageScanResult(data);
            setMealDescription(data.generated_description || '');
            setParsedMeal(data.parse_result || null);
        } catch (err) {
            setError(err.message || 'Error scanning image. Make sure the backend is running.');
        } finally {
            setImageLoading(false);
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

            handleReset();
            alert('Meal saved successfully!');
        } catch (err) {
            setError(err.message || 'Error saving meal. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMealDescription('');
        setMealType('');
        setParsedMeal(null);
        setImageScanResult(null);
        setSelectedImage(null);
        setError(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const total = parsedMeal?.total_nutrition || {};

    return (
        <PageContainer>
            <SectionHeader
                title="Log Your Meal"
                subtitle="Use either a meal photo or natural language. Both paths reuse the same nutrition pipeline."
            />

            <div style={{ marginBottom: theme.spacing.xxl }}>
                <AppCard style={{ padding: theme.spacing.lg }}>
                    <SectionHeader
                        title="🍽️ Meal Type"
                        subtitle="Optional, but it helps the habit insights page understand your routine."
                    />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: theme.spacing.md,
                    }}>
                        {mealTypes.map((type) => (
                            <AppButton
                                key={type.value}
                                variant={mealType === type.value ? 'primary' : 'secondary'}
                                onClick={() => setMealType(mealType === type.value ? '' : type.value)}
                                style={{
                                    minHeight: '62px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: theme.spacing.xs,
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

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: theme.spacing.xl,
                marginBottom: theme.spacing.xxl,
            }}>
                <AppCard style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.secondary}08)`,
                    border: `2px dashed ${theme.colors.primary}55`,
                }}>
                    <SectionHeader
                        title="📸 AI Photo Scan"
                        subtitle="Upload a meal image. If an API token is configured, it uses image classification; otherwise it falls back to demo filename detection."
                    />

                    <label style={{
                        display: 'block',
                        padding: theme.spacing.xl,
                        border: `1px dashed ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.lg,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: theme.colors.surface,
                        marginBottom: theme.spacing.lg,
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Selected meal preview"
                                style={{
                                    width: '100%',
                                    maxHeight: '220px',
                                    objectFit: 'cover',
                                    borderRadius: theme.borderRadius.lg,
                                    marginBottom: theme.spacing.md,
                                }}
                            />
                        ) : (
                            <div style={{ fontSize: '60px', marginBottom: theme.spacing.md }}>📷</div>
                        )}
                        <p style={{ margin: 0, fontWeight: 600, color: theme.colors.textPrimary }}>
                            {selectedImage ? selectedImage.name : 'Choose a meal image'}
                        </p>
                        <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: `${theme.spacing.xs} 0 0` }}>
                            JPG, PNG, or WebP works best.
                        </p>
                    </label>

                    <AppButton
                        onClick={handleScanImage}
                        disabled={imageLoading || !selectedImage}
                        style={{ width: '100%' }}
                    >
                        {imageLoading ? '⏳ Scanning Image...' : '✨ Scan Photo'}
                    </AppButton>

                    {imageScanResult && (
                        <div style={{
                            marginTop: theme.spacing.lg,
                            padding: theme.spacing.md,
                            backgroundColor: theme.colors.background,
                            borderRadius: theme.borderRadius.lg,
                            border: `1px solid ${theme.colors.border}`,
                        }}>
                            <p style={{ margin: 0, fontWeight: 700, color: theme.colors.textPrimary }}>
                                Detected: {imageScanResult.detected_label}
                            </p>
                            <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: `${theme.spacing.xs} 0` }}>
                                Source: {imageScanResult.source} · Confidence: {(imageScanResult.confidence_score * 100).toFixed(0)}%
                            </p>
                            <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                                Converted to: “{imageScanResult.generated_description}”
                            </p>
                            {imageScanResult.warning && (
                                <p style={{ ...theme.typography.small, color: theme.colors.warning, margin: `${theme.spacing.sm} 0 0` }}>
                                    {imageScanResult.warning}
                                </p>
                            )}
                        </div>
                    )}
                </AppCard>

                <AppCard style={{
                    background: `linear-gradient(135deg, ${theme.colors.secondary}10, ${theme.colors.primary}10)`,
                    border: `2px solid ${theme.colors.secondary}55`,
                }}>
                    <SectionHeader
                        title="📝 Text Meal Parser"
                        subtitle="Type naturally. The parser now handles amounts like 2 eggs, 1 apple, a cup of coffee, and spoon/tbsp wording."
                    />

                    <textarea
                        value={mealDescription}
                        onChange={(event) => setMealDescription(event.target.value)}
                        placeholder="e.g. I ate 2 eggs, 1 toast with butter, 1 apple, and a cup of coffee with milk"
                        style={{
                            width: '100%',
                            minHeight: '160px',
                            padding: theme.spacing.md,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: theme.spacing.lg,
                            boxSizing: 'border-box',
                        }}
                    />

                    <div style={{ display: 'flex', gap: theme.spacing.md }}>
                        <AppButton
                            onClick={handleParseMeal}
                            disabled={loading || !mealDescription.trim()}
                            style={{ flex: 1 }}
                        >
                            {loading ? '⏳ Analyzing...' : '🔍 Analyze Text'}
                        </AppButton>
                        <AppButton variant="secondary" onClick={handleReset} style={{ flex: 1 }}>
                            Clear
                        </AppButton>
                    </div>
                </AppCard>
            </div>

            {error && (
                <div style={{
                    padding: theme.spacing.md,
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.xl,
                    fontSize: '13px',
                }}>
                    {error}
                </div>
            )}

            {parsedMeal && (
                <div style={{ marginBottom: theme.spacing.xxl }}>
                    <AppCard style={{ border: `2px solid ${theme.colors.success}` }}>
                        <SectionHeader
                            title="Nutrition Estimate"
                            subtitle={`Overall confidence: ${parsedMeal.confidence}${parsedMeal.warning ? ` — ${parsedMeal.warning}` : ''}`}
                        />

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: theme.spacing.md,
                            marginBottom: theme.spacing.xl,
                        }}>
                            <div style={{
                                padding: theme.spacing.lg,
                                borderRadius: theme.borderRadius.lg,
                                backgroundColor: theme.colors.primary + '10',
                            }}>
                                <p style={{ ...theme.typography.small, margin: 0, color: theme.colors.textSecondary }}>Calories</p>
                                <h2 style={{ margin: `${theme.spacing.xs} 0 0`, color: theme.colors.primary }}>
                                    {(total.calories || 0).toFixed(0)}
                                </h2>
                            </div>
                            {macroItems.map((item) => (
                                <div key={item.key} style={{
                                    padding: theme.spacing.lg,
                                    borderRadius: theme.borderRadius.lg,
                                    backgroundColor: theme.colors.background,
                                }}>
                                    <p style={{ ...theme.typography.small, margin: 0, color: theme.colors.textSecondary }}>{item.label}</p>
                                    <h2 style={{ margin: `${theme.spacing.xs} 0 0`, color: theme.colors.textPrimary }}>
                                        {Number(total[item.key] || 0).toFixed(1)}{item.unit}
                                    </h2>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
                            {parsedMeal.ingredients.length > 0 ? parsedMeal.ingredients.map((ingredient, index) => (
                                <div key={`${ingredient.ingredient_name}-${index}`} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.2fr repeat(5, minmax(70px, auto))',
                                    gap: theme.spacing.md,
                                    alignItems: 'center',
                                    padding: theme.spacing.md,
                                    backgroundColor: theme.colors.background,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: '13px',
                                    overflowX: 'auto',
                                }}>
                                    <strong style={{ color: theme.colors.textPrimary }}>
                                        {ingredient.quantity} {ingredient.unit} {ingredient.ingredient_name}
                                    </strong>
                                    <span>{ingredient.calories.toFixed(0)} cal</span>
                                    <span>{ingredient.protein.toFixed(1)}g protein</span>
                                    <span>{ingredient.carbs.toFixed(1)}g carbs</span>
                                    <span>{ingredient.fat.toFixed(1)}g fat</span>
                                    <span style={{ color: ingredient.confidence === 'high' ? theme.colors.success : theme.colors.warning }}>
                                        {ingredient.confidence}
                                    </span>
                                </div>
                            )) : (
                                <p style={{ color: theme.colors.textSecondary }}>
                                    No ingredients were recognized. Try adding more specific text before saving.
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: theme.spacing.md }}>
                            <AppButton
                                onClick={handleSaveMeal}
                                disabled={loading || parsedMeal.ingredients.length === 0}
                                style={{ flex: 1 }}
                            >
                                {loading ? '💾 Saving...' : '✅ Save Meal'}
                            </AppButton>
                            <AppButton variant="secondary" onClick={() => setParsedMeal(null)} style={{ flex: 1 }}>
                                Edit Input
                            </AppButton>
                        </div>
                    </AppCard>
                </div>
            )}

            <AppCard>
                <SectionHeader
                    title="Example Inputs"
                    subtitle="These are good demo cases for showing that the NLP portion became more accurate."
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: theme.spacing.lg }}>
                    {examples.map((example) => (
                        <button
                            key={example}
                            type="button"
                            onClick={() => {
                                setMealDescription(example);
                                setParsedMeal(null);
                                setImageScanResult(null);
                            }}
                            style={{
                                padding: theme.spacing.lg,
                                backgroundColor: theme.colors.background,
                                borderRadius: theme.borderRadius.lg,
                                border: `1px solid ${theme.colors.border}`,
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontFamily: 'inherit',
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
                        </button>
                    ))}
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default MealScanner;
