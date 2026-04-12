from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from database import engine, SessionLocal
import models
import schemas
from meal_parser import parse_meal
from nutrition_service import get_nutrition

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "ChewliticsAI Backend Running"}


# ==================== Nutrition Parsing ====================


@app.post("/nutrition/parse-meal", response_model=schemas.ParseMealResponse)
def parse_meal_endpoint(request: schemas.ParseMealRequest):
    """
    Parse natural language meal description into structured ingredients + nutrition.

    Example:
        {
            "meal_description": "I ate 4 egg whites, 1 cup noodles with olives and mushrooms, and 1 spoon honey"
        }
    """
    description = request.meal_description

    # Parse ingredients from description
    parsed_ingredients = parse_meal(description)

    ingredients_nutrition = []
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    total_fiber = 0

    # Get nutrition for each ingredient
    for ingredient in parsed_ingredients:
        nutrition = get_nutrition(ingredient.name, ingredient.quantity, ingredient.unit)

        if nutrition:
            ingredients_nutrition.append(
                schemas.IngredientNutrition(
                    ingredient_name=ingredient.name,
                    quantity=ingredient.quantity,
                    unit=ingredient.unit,
                    calories=round(nutrition.calories, 2),
                    protein=round(nutrition.protein, 2),
                    carbs=round(nutrition.carbs, 2),
                    fat=round(nutrition.fat, 2),
                    fiber=round(nutrition.fiber, 2),
                )
            )

            total_calories += nutrition.calories
            total_protein += nutrition.protein
            total_carbs += nutrition.carbs
            total_fat += nutrition.fat
            total_fiber += nutrition.fiber

    return schemas.ParseMealResponse(
        ingredients=ingredients_nutrition,
        total_nutrition={
            "calories": round(total_calories, 2),
            "protein": round(total_protein, 2),
            "carbs": round(total_carbs, 2),
            "fat": round(total_fat, 2),
            "fiber": round(total_fiber, 2),
        },
    )


# ==================== Meal Logging ====================


@app.post("/meals", response_model=schemas.MealResponse)
def create_meal(meal: schemas.MealCreate, db: Session = Depends(get_db)):
    """
    Save a parsed meal to the database.
    """
    # Create meal record
    db_meal = models.Meal(
        user_id="default_user",  # MVP: hardcoded
        food_label=meal.food_label,
        meal_description=meal.meal_description,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat,
        fiber=meal.fiber,
    )

    # Add ingredients
    for ing in meal.ingredients:
        db_ingredient = models.MealIngredient(
            ingredient_name=ing.ingredient_name,
            quantity=ing.quantity,
            unit=ing.unit,
            calories=ing.calories,
            protein=ing.protein,
            carbs=ing.carbs,
            fat=ing.fat,
            fiber=ing.fiber,
        )
        db_meal.ingredients.append(db_ingredient)

    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)

    return db_meal


@app.get("/meals", response_model=list[schemas.MealResponse])
def get_meals(db: Session = Depends(get_db)):
    """
    Retrieve all logged meals (MVP: all users).
    """
    meals = db.query(models.Meal).order_by(models.Meal.timestamp.desc()).all()
    return meals


# ==================== Analytics ====================


@app.get("/analytics/daily", response_model=schemas.AnalyticsResponse)
def get_daily_analytics(db: Session = Depends(get_db)):
    """
    Get today's nutrition totals and meal list.
    """
    today = datetime.utcnow().date()
    tomorrow = today + timedelta(days=1)

    # Get meals for today
    meals = (
        db.query(models.Meal)
        .filter(func.date(models.Meal.timestamp) == today)
        .order_by(models.Meal.timestamp.desc())
        .all()
    )

    # Calculate totals
    total_calories = sum(m.calories for m in meals)
    total_protein = sum(m.protein for m in meals)
    total_carbs = sum(m.carbs for m in meals)
    total_fat = sum(m.fat for m in meals)
    total_fiber = sum(m.fiber for m in meals)

    daily_summary = schemas.DailyNutritionSummary(
        date=str(today),
        total_calories=round(total_calories, 2),
        total_protein=round(total_protein, 2),
        total_carbs=round(total_carbs, 2),
        total_fat=round(total_fat, 2),
        total_fiber=round(total_fiber, 2),
        meals_logged=len(meals),
    )

    return schemas.AnalyticsResponse(
        daily_summary=daily_summary,
        meals=meals,
    )
