"""
Small persistent nutrition cache for ChewliticsAI.

The cache stores successful USDA FoodData Central lookups so foods that are not
in core_foods.json do not need to be fetched again every time. It is intentionally
file-based instead of a new database table so it stays lightweight for the CS 152
project and keeps the feature separated from the main FastAPI routing code.
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, Optional


DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CACHE_PATH = os.path.join(DATA_DIR, "usda_nutrition_cache.json")


class NutritionCache:
    """Read/write cache for nutrition values stored per 100 grams."""

    @staticmethod
    def normalize_key(food_name: str) -> str:
        """Normalize food names so 'Tiramisu!' and 'tiramisu' use the same key."""
        cleaned = food_name.lower().strip()
        cleaned = cleaned.replace("_", " ").replace("-", " ")
        cleaned = re.sub(r"[^a-z0-9\s]+", " ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    @classmethod
    def _load_cache(cls) -> Dict[str, dict]:
        if not os.path.exists(CACHE_PATH):
            return {}

        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as file:
                data = json.load(file)
            if isinstance(data, dict):
                return data
        except (OSError, json.JSONDecodeError):
            print("Warning: nutrition cache could not be read; continuing without cache.")
        return {}

    @classmethod
    def _save_cache(cls, cache: Dict[str, dict]) -> None:
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            with open(CACHE_PATH, "w", encoding="utf-8") as file:
                json.dump(cache, file, indent=2, sort_keys=True)
        except OSError as exc:
            print(f"Warning: nutrition cache could not be saved: {exc}")

    @classmethod
    def get(cls, food_name: str) -> Optional[dict]:
        key = cls.normalize_key(food_name)
        if not key:
            return None
        return cls._load_cache().get(key)

    @classmethod
    def set(
        cls,
        food_name: str,
        nutrition_per_100g: dict,
        source: str = "USDA FoodData Central",
        source_food_id: Optional[int] = None,
        source_description: str = "",
    ) -> None:
        key = cls.normalize_key(food_name)
        if not key:
            return

        cache = cls._load_cache()
        cache[key] = {
            "food_name": key,
            "source": source,
            "source_food_id": source_food_id,
            "source_description": source_description,
            "cached_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
            "nutrition_per_100g": {
                "calories": float(nutrition_per_100g.get("calories", 0) or 0),
                "protein": float(nutrition_per_100g.get("protein", 0) or 0),
                "carbs": float(nutrition_per_100g.get("carbs", 0) or 0),
                "fat": float(nutrition_per_100g.get("fat", 0) or 0),
                "fiber": float(nutrition_per_100g.get("fiber", 0) or 0),
            },
        }
        cls._save_cache(cache)
