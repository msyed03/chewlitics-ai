"""
Meal Parser: extracts ingredients and portions from natural language meal descriptions.

This is intentionally rule-based for the CS 152 project so it clearly demonstrates
functional-style text transformation and declarative matching without needing a paid LLM.
"""

import re
from dataclasses import dataclass
from typing import List, Optional, Tuple


WORD_QUANTITIES = {
    "zero": 0,
    "half": 0.5,
    "a half": 0.5,
    "quarter": 0.25,
    "a quarter": 0.25,
    "a": 1,
    "an": 1,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
}


UNIT_ALIASES = {
    "cup": "cup",
    "cups": "cup",
    "c": "cup",
    "tablespoon": "tbsp",
    "tablespoons": "tbsp",
    "tbsp": "tbsp",
    "tbs": "tbsp",
    "spoon": "tbsp",
    "spoons": "tbsp",
    "teaspoon": "tsp",
    "teaspoons": "tsp",
    "tsp": "tsp",
    "ounce": "oz",
    "ounces": "oz",
    "oz": "oz",
    "gram": "g",
    "grams": "g",
    "g": "g",
    "pound": "lb",
    "pounds": "lb",
    "lb": "lb",
    "lbs": "lb",
    "milliliter": "ml",
    "milliliters": "ml",
    "ml": "ml",
    "liter": "l",
    "liters": "l",
    "l": "l",
    "slice": "slice",
    "slices": "slice",
    "piece": "piece",
    "pieces": "piece",
    "pc": "piece",
    "pcs": "piece",
    "serving": "serving",
    "servings": "serving",
    "bowl": "bowl",
    "bowls": "bowl",
    "plate": "plate",
    "plates": "plate",
    "can": "can",
    "cans": "can",
    "bottle": "bottle",
    "bottles": "bottle",
    "small": "item",
    "medium": "item",
    "large": "item",
    "whole": "whole",
}


# Longest/specific aliases should stay available so partial matching can prefer them.
INGREDIENT_ALIASES = {
    # eggs / breakfast
    "egg whites": "egg white",
    "egg white": "egg white",
    "eggs": "egg",
    "egg": "egg",
    "toast": "bread",
    "bread": "bread",
    "bagel": "bread",
    "oats": "oatmeal",
    "oatmeal": "oatmeal",
    "cereal": "cereal",
    "granola": "granola",
    "protein shake": "protein shake",
    "protein smoothie": "protein shake",
    "shake": "protein shake",
    # grains / carbs
    "white rice": "rice",
    "brown rice": "rice",
    "rice": "rice",
    "noodles": "pasta",
    "spaghetti": "pasta",
    "pasta": "pasta",
    "potatoes": "potato",
    "potato": "potato",
    "fries": "fries",
    "french fries": "fries",
    "pizza slices": "pizza",
    "pizza slice": "pizza",
    "pizza": "pizza",
    "tortilla": "tortilla",
    "burrito": "burrito",
    # proteins
    "grilled chicken breast": "chicken breast",
    "chicken breast": "chicken breast",
    "chicken": "chicken breast",
    "steak": "beef",
    "ground beef": "beef",
    "beef": "beef",
    "turkey": "turkey",
    "salmon": "salmon",
    "fish": "fish",
    "tuna sandwich": "tuna",
    "tuna": "tuna",
    "hamburger": "burger",
    "burger": "burger",
    # vegetables / fruit
    "mixed vegetables": "mixed vegetables",
    "vegetables": "mixed vegetables",
    "veggies": "mixed vegetables",
    "broccoli": "broccoli",
    "carrots": "carrots",
    "mushrooms": "mushrooms",
    "olives": "olives",
    "lettuce": "lettuce",
    "salad": "mixed salad",
    "apple": "apple",
    "apples": "apple",
    "banana": "banana",
    "bananas": "banana",
    "avocado": "avocado",
    "guacamole": "guacamole",
    "salsa": "salsa",
    # dairy / fats / extras
    "olive oil": "olive oil",
    "oil": "olive oil",
    "butter": "butter",
    "milk": "milk",
    "cheddar cheese": "cheese",
    "cheese": "cheese",
    "greek yogurt": "yogurt",
    "yogurt": "yogurt",
    "sour cream": "sour cream",
    "honey": "honey",
    "almonds": "almonds",
    "peanuts": "peanuts",
    "nuts": "almonds",
    "peanut butter": "peanut butter",
    "beans": "black beans",
    "black beans": "black beans",
    # drinks / desserts
    "coffee": "coffee",
    "coke": "soda",
    "soda": "soda",
    "cola": "soda",
    "cookie": "cookies",
    "cookies": "cookies",
}


FILLER_WORDS = {
    "plain",
    "fresh",
    "cooked",
    "grilled",
    "fried",
    "roasted",
    "baked",
    "steamed",
    "chopped",
    "diced",
    "sliced",
    "organic",
    "homemade",
}


@dataclass
class Ingredient:
    """Parsed ingredient with quantity, unit, normalized name, and original text."""

    name: str
    quantity: float
    unit: str
    original_text: str
    size_modifier: str = ""


class MealParser:
    """Rule-based meal parser for MVP nutrition logging."""

    def parse_meal_description(self, description: str) -> List[Ingredient]:
        if not description or not description.strip():
            return []

        cleaned = self._clean_text(description)
        parts = self._split_description(cleaned)

        ingredients: List[Ingredient] = []
        seen = set()
        for part in parts:
            ingredient = self._parse_ingredient_part(part)
            if not ingredient:
                continue

            # Keep repeated foods if their original text differs, but prevent exact duplicates
            key = (ingredient.name, ingredient.quantity, ingredient.unit, ingredient.original_text)
            if key not in seen:
                ingredients.append(ingredient)
                seen.add(key)

        return ingredients

    def _clean_text(self, text: str) -> str:
        text = text.lower().strip()
        text = text.replace("&", " and ")
        text = text.replace("½", " 1/2 ").replace("¼", " 1/4 ").replace("¾", " 3/4 ")
        text = re.sub(r"\s+", " ", text)

        # Remove common natural-language intro phrases but keep the actual food words.
        intro_patterns = [
            r"^(for\s+(breakfast|lunch|dinner|snack)\s+)?i\s+(ate|had|consumed)\s+",
            r"^(for\s+(breakfast|lunch|dinner|snack)\s+)?we\s+(ate|had|consumed)\s+",
            r"^(my\s+meal\s+was|meal\s+was|today\s+i\s+had)\s+",
        ]
        for pattern in intro_patterns:
            text = re.sub(pattern, "", text)
        return text.strip(" .")

    def _split_description(self, text: str) -> List[str]:
        # Normalize food connectors into separators. This intentionally turns
        # "burrito with steak and rice" into separate ingredients.
        text = re.sub(r"\bplus\b", ",", text)
        text = re.sub(r"\balong with\b", ",", text)
        text = re.sub(r"\bwith\b", ",", text)
        text = re.sub(r"\band\b", ",", text)
        text = re.sub(r"[;\n]+", ",", text)
        return [part.strip(" ,.") for part in text.split(",") if part.strip(" ,.")]

    def _parse_ingredient_part(self, text: str) -> Optional[Ingredient]:
        original = text.strip()
        if not original:
            return None

        quantity, unit, remaining, size_modifier = self._extract_quantity(original)
        ingredient_name = self._normalize_ingredient(remaining)
        if not ingredient_name:
            return None

        return Ingredient(
            name=ingredient_name,
            quantity=quantity,
            unit=unit,
            original_text=original,
            size_modifier=size_modifier,
        )

    def _extract_quantity(self, text: str) -> Tuple[float, str, str, str]:
        text = text.strip()
        size_modifier = ""

        # "one and a half cups rice" / "2 and 1/2 cups rice"
        compound_match = re.match(
            r"^(?P<whole>\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)\s+and\s+(?P<fraction>a\s+half|half|a\s+quarter|quarter|\d+/\d+)\s+(?P<rest>.+)$",
            text,
        )
        if compound_match:
            whole = self._quantity_from_token(compound_match.group("whole"))
            fraction = self._quantity_from_token(compound_match.group("fraction"))
            quantity = whole + fraction
            unit, remaining, size_modifier = self._extract_unit(compound_match.group("rest"))
            return quantity, unit, remaining, size_modifier

        # "1 cup rice", "2 slices pizza", "a spoon honey", "half cup oats"
        quantity_match = re.match(
            r"^(?P<qty>\d+(?:\.\d+)?|\d+/\d+|half|quarter|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(?P<rest>.+)$",
            text,
        )
        if quantity_match:
            quantity = self._quantity_from_token(quantity_match.group("qty"))
            unit, remaining, size_modifier = self._extract_unit(quantity_match.group("rest"))
            return quantity, unit, remaining, size_modifier

        # "medium banana", "large apple"
        size_match = re.match(r"^(small|medium|large)\s+(?P<rest>.+)$", text)
        if size_match:
            size_modifier = size_match.group(1)
            return 1.0, "item", size_match.group("rest"), size_modifier

        return 1.0, "unit", text, size_modifier

    def _extract_unit(self, text: str) -> Tuple[str, str, str]:
        text = text.strip()
        unit_pattern = "|".join(sorted(map(re.escape, UNIT_ALIASES.keys()), key=len, reverse=True))
        unit_match = re.match(rf"^(?P<unit>{unit_pattern})\b\s*(?:of\s+)?(?P<rest>.*)$", text)
        if unit_match:
            raw_unit = unit_match.group("unit")
            unit = UNIT_ALIASES.get(raw_unit, "unit")
            remaining = unit_match.group("rest").strip()
            size_modifier = raw_unit if raw_unit in {"small", "medium", "large"} else ""
            return unit, remaining, size_modifier

        return "unit", text, ""

    def _quantity_from_token(self, token: str) -> float:
        token = token.lower().strip()
        token = token.replace("a half", "half").replace("a quarter", "quarter")
        if token in {"a", "an"}:
            return 1.0
        if token in WORD_QUANTITIES:
            return float(WORD_QUANTITIES[token])
        if "/" in token:
            numerator, denominator = token.split("/", 1)
            try:
                return float(numerator) / float(denominator)
            except (ValueError, ZeroDivisionError):
                return 1.0
        try:
            return float(token)
        except ValueError:
            return 1.0

    def _normalize_ingredient(self, ingredient: str) -> str:
        ingredient = ingredient.lower().strip()
        ingredient = re.sub(r"^(of\s+|a\s+|an\s+|the\s+)", "", ingredient).strip()
        ingredient = re.sub(r"\b(extra|some|little|bit|side|serving|piece|pieces|cup|cups|bowl|plate)\b", " ", ingredient)
        ingredient = " ".join(word for word in ingredient.split() if word not in FILLER_WORDS)
        ingredient = re.sub(r"\s+", " ", ingredient).strip(" .")

        if not ingredient:
            return ""

        if ingredient in INGREDIENT_ALIASES:
            return INGREDIENT_ALIASES[ingredient]

        # Longest partial match wins, so "peanut butter" beats "butter".
        matches = [
            (alias, normalized)
            for alias, normalized in INGREDIENT_ALIASES.items()
            if re.search(rf"\b{re.escape(alias)}\b", ingredient)
        ]
        if matches:
            matches.sort(key=lambda item: len(item[0]), reverse=True)
            return matches[0][1]

        return ingredient


# Singleton parser instance
_parser = MealParser()


def parse_meal(description: str) -> List[Ingredient]:
    """Convenience function for parsing meal descriptions."""
    return _parser.parse_meal_description(description)
