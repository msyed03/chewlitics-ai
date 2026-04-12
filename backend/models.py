from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, default="default_user", index=True)  # MVP: hardcoded user
    original_description = Column(Text)  # Original natural language description
    parsed_ingredients = Column(Text)  # JSON string of parsed ingredients
    calories = Column(Float, default=0)
    protein = Column(Float, default=0)  # grams
    carbs = Column(Float, default=0)  # grams
    fat = Column(Float, default=0)  # grams
    fiber = Column(Float, default=0)  # grams
    meal_type = Column(String, nullable=True)  # breakfast, lunch, dinner, snack
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship to ingredients
    ingredients = relationship(
        "MealIngredient", back_populates="meal", cascade="all, delete-orphan"
    )


class MealIngredient(Base):
    __tablename__ = "meal_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), index=True)
    ingredient_name = Column(String, index=True)
    quantity = Column(Float)
    unit = Column(String)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    fiber = Column(Float)

    # Relationship to meal
    meal = relationship("Meal", back_populates="ingredients")
