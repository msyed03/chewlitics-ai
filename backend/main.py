import json

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from database import engine, SessionLocal
import models
import schemas
from meal_parser import parse_meal
from nutrition_service import get_nutrition
from vision_service import scan_food_image

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


def build_parse_meal_response(description: str) -> schemas.ParseMealResponse:
    """Shared parser + nutrition lookup used by text logging and image scanning."""
    parsed_ingredients = parse_meal(description)

    ingredients_nutrition = []
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    total_fiber = 0

    for ingredient in parsed_ingredients:
        nutrition, conf, warn = get_nutrition(
            ingredient.name, ingredient.quantity, ingredient.unit
        )

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
                    confidence=conf,
                    warning=warn,
                )
            )

            total_calories += nutrition.calories
            total_protein += nutrition.protein
            total_carbs += nutrition.carbs
            total_fat += nutrition.fat
            total_fiber += nutrition.fiber

    if not ingredients_nutrition:
        overall_confidence = "low"
        warning = "No ingredients parsed"
    elif all(i.confidence == "high" for i in ingredients_nutrition):
        overall_confidence = "high"
        warning = ""
    elif any(i.confidence in ["medium", "high"] for i in ingredients_nutrition):
        overall_confidence = "medium"
        warning = "Some ingredients used estimated values"
    else:
        overall_confidence = "low"
        warning = "Estimated using generic serving assumptions"

    return schemas.ParseMealResponse(
        ingredients=ingredients_nutrition,
        total_nutrition={
            "calories": round(total_calories, 2),
            "protein": round(total_protein, 2),
            "carbs": round(total_carbs, 2),
            "fat": round(total_fat, 2),
            "fiber": round(total_fiber, 2),
        },
        confidence=overall_confidence,
        warning=warning,
    )


@app.post("/nutrition/parse-meal", response_model=schemas.ParseMealResponse)
def parse_meal_endpoint(request: schemas.ParseMealRequest):
    """
    Parse natural language meal description into structured ingredients + nutrition.

    Example:
        {
            "meal_description": "I ate 4 egg whites, 1 cup noodles with olives and mushrooms, and 1 spoon honey"
        }
    """
    return build_parse_meal_response(request.meal_description)


@app.post("/vision/scan-meal", response_model=schemas.ImageScanResponse)
async def scan_meal_image_endpoint(file: UploadFile = File(...)):
    """
    Upload a food image, identify the most likely food, convert it into a text meal
    description, then reuse the same NLP + nutrition pipeline.
    """
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image was empty")

    vision_result = scan_food_image(
        image_bytes=image_bytes,
        filename=file.filename or "",
        content_type=file.content_type or "image/jpeg",
    )
    parse_result = build_parse_meal_response(vision_result.generated_description)

    return schemas.ImageScanResponse(
        detected_label=vision_result.label,
        confidence_score=round(vision_result.confidence_score, 4),
        source=vision_result.source,
        generated_description=vision_result.generated_description,
        parse_result=parse_result,
        warning=vision_result.warning,
        top_predictions=[
            schemas.ImageScanPrediction(label=p.label, score=round(p.score, 4))
            for p in vision_result.top_predictions
        ],
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
        original_description=meal.original_description,
        parsed_ingredients=meal.parsed_ingredients,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat,
        fiber=meal.fiber,
        meal_type=meal.meal_type,
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


@app.delete("/meals/{meal_id}")
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    """
    Delete a meal by ID.
    """
    meal = db.query(models.Meal).filter(models.Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted successfully"}


@app.put("/meals/{meal_id}", response_model=schemas.MealResponse)
def update_meal(
    meal_id: int, meal_update: schemas.MealUpdate, db: Session = Depends(get_db)
):
    """
    Update a meal by ID.
    """
    meal = db.query(models.Meal).filter(models.Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    # Re-parse description when it changes and update nutrition data.
    if "original_description" in meal_update.__fields_set__:
        if meal_update.original_description is not None:
            meal.original_description = meal_update.original_description

            parsed_ingredients = parse_meal(meal_update.original_description)
            ingredients_nutrition = []
            total_calories = 0
            total_protein = 0
            total_carbs = 0
            total_fat = 0
            total_fiber = 0

            for ingredient in parsed_ingredients:
                nutrition, conf, warn = get_nutrition(
                    ingredient.name, ingredient.quantity, ingredient.unit
                )
                if not nutrition:
                    continue
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
                        confidence=conf,
                        warning=warn,
                    )
                )
                total_calories += nutrition.calories
                total_protein += nutrition.protein
                total_carbs += nutrition.carbs
                total_fat += nutrition.fat
                total_fiber += nutrition.fiber

            meal.parsed_ingredients = json.dumps(
                [ing.dict() for ing in ingredients_nutrition]
            )
            meal.calories = round(total_calories, 2)
            meal.protein = round(total_protein, 2)
            meal.carbs = round(total_carbs, 2)
            meal.fat = round(total_fat, 2)
            meal.fiber = round(total_fiber, 2)

            # Replace ingredient rows.
            meal.ingredients.clear()
            for ing in ingredients_nutrition:
                db_ingredient = models.MealIngredient(
                    ingredient_name=ing.ingredient_name,
                    quantity=ing.quantity,
                    unit=ing.unit,
                    calories=ing.calories,
                    protein=ing.protein,
                    carbs=ing.carbs,
                    fat=ing.fat,
                    fiber=ing.fiber,
                    meal=meal,
                )
                meal.ingredients.append(db_ingredient)

    if "meal_type" in meal_update.__fields_set__:
        meal.meal_type = meal_update.meal_type

    db.commit()
    db.refresh(meal)
    return meal


# ==================== Analytics ====================


@app.get("/analytics/daily", response_model=schemas.AnalyticsResponse)
def get_daily_analytics(db: Session = Depends(get_db)):
    """
    Get today's nutrition totals and meal list.
    """
    today = datetime.utcnow().date()

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


@app.get("/analytics/weekly", response_model=schemas.WeeklyAnalyticsResponse)
def get_weekly_analytics(db: Session = Depends(get_db)):
    """
    Get weekly nutrition totals and trends.
    """
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=6)  # Last 7 days including today

    # Get meals for the week
    meals = (
        db.query(models.Meal)
        .filter(func.date(models.Meal.timestamp) >= week_start)
        .order_by(models.Meal.timestamp.desc())
        .all()
    )

    # Group by day
    daily_totals = {}
    for meal in meals:
        day = meal.timestamp.date()
        if day not in daily_totals:
            daily_totals[day] = {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "fiber": 0,
                "meals_count": 0,
            }
        daily_totals[day]["calories"] += meal.calories
        daily_totals[day]["protein"] += meal.protein
        daily_totals[day]["carbs"] += meal.carbs
        daily_totals[day]["fat"] += meal.fat
        daily_totals[day]["fiber"] += meal.fiber
        daily_totals[day]["meals_count"] += 1

    # Calculate weekly averages
    total_days = (today - week_start).days + 1
    weekly_summary = schemas.WeeklyNutritionSummary(
        week_start=str(week_start),
        week_end=str(today),
        avg_daily_calories=round(
            sum(d["calories"] for d in daily_totals.values()) / total_days, 2
        ),
        avg_daily_protein=round(
            sum(d["protein"] for d in daily_totals.values()) / total_days, 2
        ),
        avg_daily_carbs=round(
            sum(d["carbs"] for d in daily_totals.values()) / total_days, 2
        ),
        avg_daily_fat=round(
            sum(d["fat"] for d in daily_totals.values()) / total_days, 2
        ),
        avg_daily_fiber=round(
            sum(d["fiber"] for d in daily_totals.values()) / total_days, 2
        ),
        total_meals_logged=len(meals),
        days_logged=len(daily_totals),
    )

    # Daily breakdown
    daily_breakdown = [
        schemas.DailyNutritionSummary(
            date=str(day),
            total_calories=round(daily_totals[day]["calories"], 2),
            total_protein=round(daily_totals[day]["protein"], 2),
            total_carbs=round(daily_totals[day]["carbs"], 2),
            total_fat=round(daily_totals[day]["fat"], 2),
            total_fiber=round(daily_totals[day]["fiber"], 2),
            meals_logged=daily_totals[day]["meals_count"],
        )
        for day in sorted(daily_totals.keys())
    ]

    return schemas.WeeklyAnalyticsResponse(
        weekly_summary=weekly_summary,
        daily_breakdown=daily_breakdown,
        meals=meals,
    )
