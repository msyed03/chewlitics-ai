from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class IngredientNutrition(BaseModel):
    """Nutrition breakdown for a single ingredient."""

    ingredient_name: str
    quantity: float
    unit: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    confidence: str
    warning: str = ""


class ParseMealRequest(BaseModel):
    """Request to parse a meal description."""

    meal_description: str


class ParseMealResponse(BaseModel):
    """Response from meal parsing."""

    ingredients: List[IngredientNutrition]
    total_nutrition: dict  # {calories, protein, carbs, fat, fiber}
    confidence: str
    warning: str = ""




class ImageScanPrediction(BaseModel):
    """Single food-image prediction option."""

    label: str
    score: float


class ImageScanResponse(BaseModel):
    """Response from image-based meal scanning."""

    detected_label: str
    confidence_score: float
    source: str
    generated_description: str
    parse_result: ParseMealResponse
    warning: str = ""
    top_predictions: List[ImageScanPrediction] = []


class MealIngredientResponse(BaseModel):
    """Individual ingredient in a meal."""

    ingredient_name: str
    quantity: float
    unit: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float

    class Config:
        from_attributes = True


class MealCreate(BaseModel):
    """Request to create/save a meal."""

    original_description: str
    parsed_ingredients: str  # JSON string
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    meal_type: Optional[str] = None
    ingredients: List[MealIngredientResponse]


class MealUpdate(BaseModel):
    """Request to update a meal."""

    original_description: Optional[str] = None
    meal_type: Optional[str] = None


class MealResponse(BaseModel):
    """Response containing meal details."""

    id: int
    user_id: str
    original_description: str
    parsed_ingredients: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    meal_type: Optional[str]
    timestamp: datetime
    ingredients: List[MealIngredientResponse] = []

    class Config:
        from_attributes = True


class DailyNutritionSummary(BaseModel):
    """Daily nutrition totals."""

    date: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    meals_logged: int


class AnalyticsResponse(BaseModel):
    """Analytics data."""

    daily_summary: DailyNutritionSummary
    meals: List[MealResponse] = []


class WeeklyNutritionSummary(BaseModel):
    """Weekly nutrition averages."""

    week_start: str
    week_end: str
    avg_daily_calories: float
    avg_daily_protein: float
    avg_daily_carbs: float
    avg_daily_fat: float
    avg_daily_fiber: float
    total_meals_logged: int
    days_logged: int


class WeeklyAnalyticsResponse(BaseModel):
    """Weekly analytics data."""

    weekly_summary: WeeklyNutritionSummary
    daily_breakdown: List[DailyNutritionSummary] = []
    meals: List[MealResponse] = []
