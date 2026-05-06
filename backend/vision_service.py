"""
Food image recognition helper for ChewliticsAI.

The project can run in two modes:
1. Optional Hugging Face Food-101 image-classification API when HF_API_TOKEN is set.
2. Offline demo fallback that guesses from the uploaded filename so the feature still works
   during class demos without a token or heavy local model download.
"""

import os
import re
from dataclasses import dataclass
from typing import List, Optional

import requests
from dotenv import load_dotenv

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN", "").strip()
HF_FOOD_MODEL = os.getenv("HF_FOOD_MODEL", "nateraw/food")
HF_API_URL = os.getenv(
    "HF_FOOD_API_URL",
    f"https://api-inference.huggingface.co/models/{HF_FOOD_MODEL}",
)
MIN_API_SCORE = float(os.getenv("FOOD_VISION_MIN_SCORE", "0.15"))


@dataclass
class FoodPrediction:
    label: str
    score: float


@dataclass
class FoodVisionResult:
    label: str
    confidence_score: float
    source: str
    generated_description: str
    warning: str
    top_predictions: List[FoodPrediction]


# Food-101 style labels -> descriptions that the existing NLP nutrition pipeline can parse.
LABEL_TO_DESCRIPTION = {
    "apple_pie": "1 slice apple pie",
    "baby_back_ribs": "1 serving ribs",
    "baklava": "1 serving baklava",
    "beef_carpaccio": "1 serving beef",
    "beef_tartare": "1 serving beef",
    "beet_salad": "mixed salad with beets",
    "beignets": "1 serving beignets",
    "bibimbap": "rice with beef, egg, and mixed vegetables",
    "bread_pudding": "1 serving bread pudding",
    "breakfast_burrito": "1 burrito with egg, cheese, tortilla, and salsa",
    "bruschetta": "bread with tomatoes and olive oil",
    "caesar_salad": "mixed salad with chicken breast and cheese",
    "cannoli": "1 serving cannoli",
    "caprese_salad": "mixed salad with cheese and tomatoes",
    "carrot_cake": "1 slice carrot cake",
    "cheese_plate": "2 oz cheese",
    "cheesecake": "1 slice cheesecake",
    "chicken_curry": "chicken breast with rice",
    "chicken_quesadilla": "tortilla with chicken breast and cheese",
    "chicken_wings": "1 serving chicken wings",
    "chocolate_cake": "1 slice chocolate cake",
    "chocolate_mousse": "1 serving chocolate mousse",
    "club_sandwich": "sandwich with bread, turkey, lettuce, and cheese",
    "crab_cakes": "1 serving crab cakes",
    "creme_brulee": "1 serving creme brulee",
    "croque_madame": "bread with egg, cheese, and ham",
    "cup_cakes": "1 cupcake",
    "deviled_eggs": "2 eggs",
    "donuts": "1 donut",
    "dumplings": "1 serving dumplings",
    "edamame": "1 serving edamame",
    "eggs_benedict": "2 eggs with bread and butter",
    "falafel": "1 serving falafel",
    "filet_mignon": "6 oz beef",
    "fish_and_chips": "fish with fries",
    "foie_gras": "1 serving foie gras",
    "french_fries": "1 serving fries",
    "french_onion_soup": "1 bowl soup with cheese and bread",
    "french_toast": "2 slices bread with egg and butter",
    "fried_calamari": "1 serving fried calamari",
    "fried_rice": "1 cup rice with egg and mixed vegetables",
    "frozen_yogurt": "1 cup yogurt",
    "garlic_bread": "2 slices bread with butter",
    "gnocchi": "1 cup pasta",
    "greek_salad": "mixed salad with olives and cheese",
    "grilled_cheese_sandwich": "sandwich with bread, cheese, and butter",
    "grilled_salmon": "1 piece salmon",
    "guacamole": "2 tbsp guacamole",
    "gyoza": "1 serving dumplings",
    "hamburger": "1 burger with beef, bread, cheese, and lettuce",
    "hot_and_sour_soup": "1 bowl soup",
    "hot_dog": "1 hot dog",
    "huevos_rancheros": "2 eggs with tortilla, salsa, and black beans",
    "hummus": "2 tbsp hummus",
    "ice_cream": "1 cup ice cream",
    "lasagna": "1 serving pasta with beef and cheese",
    "lobster_bisque": "1 bowl soup",
    "lobster_roll_sandwich": "sandwich with bread and lobster",
    "macaroni_and_cheese": "1 cup pasta with cheese",
    "macarons": "2 cookies",
    "miso_soup": "1 bowl soup",
    "mussels": "1 serving mussels",
    "nachos": "1 serving tortilla chips with cheese, salsa, and guacamole",
    "omelette": "2 eggs with cheese and mushrooms",
    "onion_rings": "1 serving onion rings",
    "oysters": "1 serving oysters",
    "pad_thai": "1 cup noodles with egg and peanuts",
    "paella": "rice with seafood and mixed vegetables",
    "pancakes": "2 pancakes with butter",
    "panna_cotta": "1 serving panna cotta",
    "peking_duck": "1 serving duck",
    "pho": "1 bowl noodles with beef",
    "pizza": "2 slices pizza",
    "pork_chop": "1 pork chop",
    "poutine": "fries with cheese",
    "prime_rib": "6 oz beef",
    "pulled_pork_sandwich": "sandwich with bread and pork",
    "ramen": "1 bowl noodles with egg",
    "ravioli": "1 cup pasta with cheese",
    "red_velvet_cake": "1 slice cake",
    "risotto": "1 cup rice with cheese",
    "samosa": "1 serving samosa",
    "sashimi": "1 serving fish",
    "scallops": "1 serving scallops",
    "seaweed_salad": "mixed salad",
    "shrimp_and_grits": "shrimp with rice",
    "spaghetti_bolognese": "1 cup pasta with beef",
    "spaghetti_carbonara": "1 cup pasta with egg and cheese",
    "spring_rolls": "2 spring rolls",
    "steak": "6 oz beef",
    "strawberry_shortcake": "1 slice cake",
    "sushi": "1 serving fish with rice",
    "tacos": "2 tacos with beef, cheese, lettuce, and salsa",
    "takoyaki": "1 serving takoyaki",
    "tiramisu": "1 slice tiramisu",
    "tuna_tartare": "1 serving tuna",
    "waffles": "2 waffles with butter",
}

# Plain keyword fallback for filenames like "pizza.jpg" or "breakfast_burrito.png".
FILENAME_KEYWORDS = {
    "pizza": "2 slices pizza",
    "burrito": "1 burrito with rice, black beans, cheese, salsa, and guacamole",
    "breakfast_burrito": "1 burrito with egg, cheese, tortilla, and salsa",
    "burger": "1 burger with beef, bread, cheese, and lettuce",
    "hamburger": "1 burger with beef, bread, cheese, and lettuce",
    "steak": "6 oz beef",
    "chicken": "1 chicken breast with rice and broccoli",
    "salmon": "1 piece salmon with rice and broccoli",
    "tuna": "1 serving tuna with bread and lettuce",
    "sushi": "1 serving fish with rice",
    "ramen": "1 bowl noodles with egg",
    "pho": "1 bowl noodles with beef",
    "pasta": "1 cup pasta with cheese",
    "spaghetti": "1 cup pasta with beef",
    "salad": "mixed salad with chicken breast",
    "rice": "1 cup rice",
    "egg": "2 eggs",
    "eggs": "2 eggs",
    "apple": "1 apple",
    "banana": "1 banana",
    "fries": "1 serving fries",
    "sandwich": "sandwich with bread, turkey, lettuce, and cheese",
    "tacos": "2 tacos with beef, cheese, lettuce, and salsa",
    "taco": "2 tacos with beef, cheese, lettuce, and salsa",
}


def normalize_label(label: str) -> str:
    return re.sub(r"[^a-z0-9_]+", "", label.lower().strip().replace(" ", "_"))


def label_to_description(label: str) -> str:
    normalized = normalize_label(label)
    if normalized in LABEL_TO_DESCRIPTION:
        return LABEL_TO_DESCRIPTION[normalized]

    readable = normalized.replace("_", " ").strip()
    if readable:
        return readable
    return "unknown food"


class FoodVisionService:
    """Optional API-based food image classifier with offline fallback."""

    @staticmethod
    def scan_image(image_bytes: bytes, filename: str = "", content_type: str = "image/jpeg") -> FoodVisionResult:
        api_result = FoodVisionService._scan_with_hugging_face(image_bytes, content_type)
        if api_result and api_result.confidence_score >= MIN_API_SCORE:
            return api_result

        fallback = FoodVisionService._scan_from_filename(filename)
        if fallback:
            if api_result:
                fallback.warning = (
                    "Hugging Face returned a low-confidence result, so the app used the filename fallback."
                )
            return fallback

        if api_result:
            api_result.warning = (
                "Image API responded, but confidence was low. Review the generated meal description before saving."
            )
            return api_result

        return FoodVisionResult(
            label="unknown food",
            confidence_score=0.0,
            source="unavailable",
            generated_description="unknown food",
            warning=(
                "No image API token was configured and the filename did not contain a recognizable food. "
                "Enter a text description or set HF_API_TOKEN for real image classification."
            ),
            top_predictions=[],
        )

    @staticmethod
    def _scan_with_hugging_face(image_bytes: bytes, content_type: str) -> Optional[FoodVisionResult]:
        if not HF_API_TOKEN:
            return None

        try:
            response = requests.post(
                HF_API_URL,
                headers={
                    "Authorization": f"Bearer {HF_API_TOKEN}",
                    "Content-Type": content_type or "application/octet-stream",
                },
                data=image_bytes,
                timeout=20,
            )
            response.raise_for_status()
            payload = response.json()

            if isinstance(payload, dict) and "error" in payload:
                print(f"Food vision API error: {payload['error']}")
                return None

            predictions = []
            if isinstance(payload, list):
                for item in payload[:5]:
                    label = str(item.get("label", "unknown food"))
                    score = float(item.get("score", 0.0))
                    predictions.append(FoodPrediction(label=label, score=score))

            if not predictions:
                return None

            best = predictions[0]
            return FoodVisionResult(
                label=best.label,
                confidence_score=best.score,
                source="huggingface",
                generated_description=label_to_description(best.label),
                warning="",
                top_predictions=predictions,
            )
        except Exception as exc:
            print(f"Food vision API request failed: {exc}")
            return None

    @staticmethod
    def _scan_from_filename(filename: str) -> Optional[FoodVisionResult]:
        normalized = normalize_label(filename or "")
        if not normalized:
            return None

        # Prefer longer keywords like breakfast_burrito over burrito.
        for keyword, description in sorted(FILENAME_KEYWORDS.items(), key=lambda item: len(item[0]), reverse=True):
            if keyword in normalized:
                return FoodVisionResult(
                    label=keyword.replace("_", " "),
                    confidence_score=0.55,
                    source="filename-fallback",
                    generated_description=description,
                    warning=(
                        "Demo fallback used the image filename instead of true computer vision. "
                        "Set HF_API_TOKEN to enable real image classification."
                    ),
                    top_predictions=[FoodPrediction(label=keyword.replace("_", " "), score=0.55)],
                )

        return None


def scan_food_image(image_bytes: bytes, filename: str = "", content_type: str = "image/jpeg") -> FoodVisionResult:
    return FoodVisionService.scan_image(image_bytes, filename, content_type)
