"""
Nutrition Service: Fetches nutrition data from USDA FoodData Central API.
"""

import requests
import os
import json
from typing import Dict, Optional, List, Tuple
from dataclasses import dataclass
from dotenv import load_dotenv
from nutrition_cache import NutritionCache

load_dotenv()


USDA_API_KEY = os.getenv("USDA_API_KEY", "DEMO_KEY")
if USDA_API_KEY == "DEMO_KEY":
    print(
        "Warning: Using DEMO_KEY for USDA API. Get a real key for higher rate limits."
    )
USDA_API_URL = "https://fdc.nal.usda.gov/api/foods/search"


CORE_FOODS_PATH = os.path.join(os.path.dirname(__file__), "data", "core_foods.json")
CORE_FOODS = {}
try:
    with open(CORE_FOODS_PATH, "r") as f:
        CORE_FOODS = json.load(f)
except FileNotFoundError:
    print("Warning: core_foods.json not found")
except json.JSONDecodeError:
    print("Warning: core_foods.json invalid")


@dataclass
class NutritionData:
    """Nutrition information for a food item."""

    calories: float
    protein: float  # grams
    carbs: float  # grams
    fat: float  # grams
    fiber: float  # grams


# Local nutrition database for MVP (fallback when API is unavailable)
LOCAL_NUTRITION_DB = {
    "egg white": {"calories": 17, "protein": 3.6, "carbs": 0.4, "fat": 0.1, "fiber": 0},
    "egg": {"calories": 78, "protein": 6.3, "carbs": 0.6, "fat": 5.3, "fiber": 0},
    "pasta": {"calories": 131, "protein": 5, "carbs": 25, "fat": 1.1, "fiber": 1.8},
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3, "fiber": 0.4},
    "chicken breast": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0,
    },
    "beef": {"calories": 250, "protein": 26, "carbs": 0, "fat": 15, "fiber": 0},
    "salmon": {"calories": 280, "protein": 25, "carbs": 0, "fat": 20, "fiber": 0},
    "tuna": {"calories": 144, "protein": 30, "carbs": 0, "fat": 1.3, "fiber": 0},
    "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7, "fat": 0.4, "fiber": 2.4},
    "carrots": {"calories": 41, "protein": 0.9, "carbs": 10, "fat": 0.2, "fiber": 2.8},
    "mushrooms": {"calories": 22, "protein": 3.1, "carbs": 3.3, "fat": 0.3, "fiber": 1},
    "olives": {
        "calories": 115,
        "protein": 0.8,
        "carbs": 6.3,
        "fat": 10.7,
        "fiber": 1.6,
    },
    "avocado": {"calories": 160, "protein": 2, "carbs": 9, "fat": 15, "fiber": 7},
    "honey": {"calories": 64, "protein": 0.1, "carbs": 17, "fat": 0, "fiber": 0},
    "olive oil": {"calories": 119, "protein": 0, "carbs": 0, "fat": 13.5, "fiber": 0},
    "butter": {"calories": 717, "protein": 0.9, "carbs": 0.1, "fat": 81.1, "fiber": 0},
    "milk": {"calories": 64, "protein": 3.2, "carbs": 4.8, "fat": 3.3, "fiber": 0},
    "cheese": {"calories": 113, "protein": 7, "carbs": 0.7, "fat": 9, "fiber": 0},
    "cheddar cheese": {
        "calories": 113,
        "protein": 7,
        "carbs": 0.7,
        "fat": 9,
        "fiber": 0,
    },
    "greek yogurt": {
        "calories": 59,
        "protein": 10,
        "carbs": 3.3,
        "fat": 0.4,
        "fiber": 0,
    },
    "bread": {"calories": 79, "protein": 2.7, "carbs": 14.1, "fat": 1, "fiber": 2.1},
    "mixed vegetables": {
        "calories": 35,
        "protein": 2.5,
        "carbs": 7,
        "fat": 0.3,
        "fiber": 2,
    },
    "mixed salad": {
        "calories": 25,
        "protein": 1.5,
        "carbs": 5,
        "fat": 0.2,
        "fiber": 1.5,
    },
    "black beans": {
        "calories": 132,
        "protein": 8.9,
        "carbs": 24,
        "fat": 0.5,
        "fiber": 6.4,
    },
    "oatmeal": {"calories": 150, "protein": 5, "carbs": 27, "fat": 3, "fiber": 4},
    "almonds": {
        "calories": 579,
        "protein": 21.1,
        "carbs": 21.5,
        "fat": 49.9,
        "fiber": 12.5,
    },
    "peanuts": {
        "calories": 567,
        "protein": 25.8,
        "carbs": 16.1,
        "fat": 49.2,
        "fiber": 8.6,
    },
    "peanut butter": {
        "calories": 588,
        "protein": 25.4,
        "carbs": 20,
        "fat": 50.4,
        "fiber": 6,
    },
    "cereal": {"calories": 380, "protein": 7, "carbs": 85, "fat": 2, "fiber": 3},
    "granola": {"calories": 471, "protein": 11, "carbs": 61, "fat": 20, "fiber": 7},
    "apple": {"calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2, "fiber": 2.4},
    "banana": {"calories": 89, "protein": 1.1, "carbs": 23, "fat": 0.3, "fiber": 2.6},
    "coffee": {"calories": 1, "protein": 0.1, "carbs": 0, "fat": 0, "fiber": 0},
    "cookies": {"calories": 50, "protein": 1, "carbs": 7, "fat": 2, "fiber": 0.3},
    "lettuce": {"calories": 5, "protein": 0.5, "carbs": 1, "fat": 0, "fiber": 0.5},
    # Add hundreds more for fruits, veggies, meats, etc.
}


class NutritionService:
    """Service for fetching nutrition data."""

    @staticmethod
    def get_nutrition(
        ingredient_name: str, quantity: float = 1.0, unit: str = "unit"
    ) -> Tuple[Optional[NutritionData], str, str]:
        """
        Fetch nutrition data for an ingredient.

        Ideal pipeline:
        1. Use curated core_foods.json when available.
        2. Use saved USDA cache when this food was previously looked up.
        3. Query USDA FoodData Central for new foods.
        4. Cache successful USDA lookups for next time.
        5. Fall back to the older local dictionary if API data is unavailable.

        Returns (nutrition, confidence, warning).
        """
        normalized_name = NutritionService._normalize_food_name(ingredient_name)

        # Normalize quantity to grams for calculations.
        quantity_grams = NutritionService._convert_to_grams(
            quantity, unit, normalized_name
        )

        # 1. Try the curated local food table first.
        core_entry = NutritionService._get_core_food_entry(normalized_name)
        if core_entry:
            food_key, food_data = core_entry
            portion_weights = food_data["portion_weights"]
            default_unit = food_data["default_unit"]
            if unit in portion_weights:
                grams = quantity * portion_weights[unit]
            else:
                grams = quantity * portion_weights.get(default_unit, 100)
            nutrition = NutritionService._nutrition_from_per_100g(
                food_data["nutrition_per_100g"], grams
            )
            return nutrition, "high", f"Used local nutrition estimate for {food_key}."

        # 2. Try cached USDA results before making a network request.
        cached = NutritionCache.get(normalized_name)
        if cached:
            nutrition = NutritionService._nutrition_from_per_100g(
                cached.get("nutrition_per_100g", {}), quantity_grams
            )
            return nutrition, "medium", "Used cached USDA nutrition data."

        # 3. Try USDA API for foods missing from the local table/cache.
        usda_result = NutritionService._fetch_from_usda(normalized_name)
        if usda_result:
            nutrition, metadata = usda_result
            NutritionCache.set(
                normalized_name,
                NutritionService._nutrition_to_dict(nutrition),
                source="USDA FoodData Central",
                source_food_id=metadata.get("fdc_id"),
                source_description=metadata.get("description", ""),
            )
            scaled = NutritionService._scale_nutrition(nutrition, quantity_grams)
            return scaled, "medium", "Used USDA FoodData Central and cached this food for future scans."

        # 4. Last local fallback for common ingredients.
        nutrition = NutritionService._fetch_from_local_db(normalized_name)
        if nutrition:
            scaled = NutritionService._scale_nutrition(nutrition, quantity_grams)
            return scaled, "low", "Estimated using generic serving assumptions."

        return None, "low", "No nutrition data found. Try editing the meal description or adding this food to core_foods.json."

    @staticmethod
    def _convert_to_grams(quantity: float, unit: str, ingredient_name: str) -> float:
        """
        Convert quantity + unit to approximate grams.

        Curated foods use their own portion weights first. This generic converter
        is mainly for USDA/cache/local fallback values that are stored per 100g.
        """
        conversions = {
            "cup": 240,
            "tbsp": 15,
            "tsp": 5,
            "oz": 28,
            "g": 1,
            "lb": 454,
            "l": 1000,
            "ml": 1,
            "slice": 100,
            "piece": 100,
            "serving": 150,
            "bowl": 400,
            "plate": 350,
            "can": 355,
            "bottle": 591,
            "item": 100,
            "whole": 100,
            "unit": 100,
        }
        grams_per_unit = conversions.get(unit, 100)
        return quantity * grams_per_unit

    @staticmethod
    def _normalize_food_name(food_name: str) -> str:
        """Normalize ingredient names before cache/API lookup."""
        normalized = NutritionCache.normalize_key(food_name)
        # Tiny singularization helper for simple plurals not handled by meal_parser.
        if normalized not in CORE_FOODS and normalized.endswith("s"):
            singular = normalized[:-1]
            if singular in CORE_FOODS:
                return singular
        return normalized

    @staticmethod
    def _get_core_food_entry(food_name: str) -> Optional[Tuple[str, dict]]:
        """Return a matching core food entry using exact and simple singular matching."""
        if food_name in CORE_FOODS:
            return food_name, CORE_FOODS[food_name]
        if food_name.endswith("s") and food_name[:-1] in CORE_FOODS:
            key = food_name[:-1]
            return key, CORE_FOODS[key]
        return None

    @staticmethod
    def _nutrition_from_per_100g(nutrition_per_100g: dict, grams: float) -> NutritionData:
        scale = grams / 100
        return NutritionData(
            calories=float(nutrition_per_100g.get("calories", 0) or 0) * scale,
            protein=float(nutrition_per_100g.get("protein", 0) or 0) * scale,
            carbs=float(nutrition_per_100g.get("carbs", 0) or 0) * scale,
            fat=float(nutrition_per_100g.get("fat", 0) or 0) * scale,
            fiber=float(nutrition_per_100g.get("fiber", 0) or 0) * scale,
        )

    @staticmethod
    def _nutrition_to_dict(nutrition: NutritionData) -> dict:
        return {
            "calories": nutrition.calories,
            "protein": nutrition.protein,
            "carbs": nutrition.carbs,
            "fat": nutrition.fat,
            "fiber": nutrition.fiber,
        }

    @staticmethod
    def _fetch_from_usda(ingredient_name: str) -> Optional[Tuple[NutritionData, dict]]:
        """Fetch per-100g nutrition from USDA FoodData Central API."""
        try:
            params = {
                "query": ingredient_name,
                "pageSize": 1,
                "api_key": USDA_API_KEY,
            }
            response = requests.get(USDA_API_URL, params=params, timeout=8)
            response.raise_for_status()

            data = response.json()
            foods = data.get("foods") or []
            if not foods:
                return None

            food = foods[0]
            nutrients = NutritionService._extract_usda_nutrients(food)
            metadata = {
                "fdc_id": food.get("fdcId"),
                "description": food.get("description", ""),
            }
            return nutrients, metadata
        except Exception as e:
            print(f"USDA API error for '{ingredient_name}': {e}")

        return None

    @staticmethod
    def _extract_usda_nutrients(food: dict) -> NutritionData:
        """Extract calories/macros from USDA response in a more tolerant way."""
        result = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "fiber": 0.0}

        for nutrient in food.get("foodNutrients", []):
            name = str(nutrient.get("nutrientName", "")).lower()
            number = str(nutrient.get("nutrientNumber", ""))
            unit_name = str(nutrient.get("unitName", "")).upper()
            value = nutrient.get("value", nutrient.get("amount", 0)) or 0

            try:
                value = float(value)
            except (TypeError, ValueError):
                value = 0.0

            if (number == "1008" or name == "energy") and unit_name in {"KCAL", "CAL", ""}:
                result["calories"] = value
            elif number == "1003" or name == "protein":
                result["protein"] = value
            elif number == "1005" or "carbohydrate" in name:
                result["carbs"] = value
            elif number == "1004" or "total lipid" in name or name == "fat":
                result["fat"] = value
            elif number == "1079" or "fiber" in name:
                result["fiber"] = value

        return NutritionData(**result)

    @staticmethod
    def _fetch_from_local_db(ingredient_name: str) -> Optional[NutritionData]:
        """Fetch nutrition from local database."""
        ingredient_name = ingredient_name.lower().strip()

        if ingredient_name in LOCAL_NUTRITION_DB:
            data = LOCAL_NUTRITION_DB[ingredient_name]
            return NutritionData(
                calories=data["calories"],
                protein=data["protein"],
                carbs=data["carbs"],
                fat=data["fat"],
                fiber=data["fiber"],
            )

        return None

    @staticmethod
    def _scale_nutrition(
        nutrition: NutritionData, quantity_grams: float
    ) -> NutritionData:
        """Scale nutrition by quantity in grams (per 100g baseline)."""
        # Assume local_db values are per 100g
        scale = quantity_grams / 100
        return NutritionData(
            calories=nutrition.calories * scale,
            protein=nutrition.protein * scale,
            carbs=nutrition.carbs * scale,
            fat=nutrition.fat * scale,
            fiber=nutrition.fiber * scale,
        )


def get_nutrition(
    ingredient_name: str, quantity: float = 1.0, unit: str = "unit"
) -> Tuple[Optional[NutritionData], str, str]:
    """Convenience function to get nutrition data."""
    return NutritionService.get_nutrition(ingredient_name, quantity, unit)
