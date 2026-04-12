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


class ParseMealRequest(BaseModel):
    """Request to parse a meal description."""

    meal_description: str


class ParseMealResponse(BaseModel):
    """Response from meal parsing."""

    ingredients: List[IngredientNutrition]
    total_nutrition: dict  # {calories, protein, carbs, fat, fiber}


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
        orm_mode = True


class MealCreate(BaseModel):
    """Request to create/save a meal."""

    food_label: str
    meal_description: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    ingredients: List[MealIngredientResponse]


class MealResponse(BaseModel):
    """Response containing meal details."""

    id: int
    user_id: str
    food_label: str
    meal_description: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    timestamp: datetime
    ingredients: List[MealIngredientResponse] = []

    class Config:
        orm_mode = True


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
