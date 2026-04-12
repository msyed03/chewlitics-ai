"""
Meal Parser: Extracts ingredients and quantities from natural language meal descriptions.
Uses rule-based parsing for MVP. Designed to be modular for future LLM upgrades.
"""

import re
from typing import List, Dict, Tuple
from dataclasses import dataclass


@dataclass
class Ingredient:
    """Parsed ingredient with quantity, unit, and name."""

    name: str
    quantity: float
    unit: str
    original_text: str


class MealParser:
    """
    Rule-based meal parser for extracting structured ingredients from natural language.
    """

    # Common quantity words
    QUANTITY_PATTERNS = {
        r"(\d+\.?\d*)\s*(cups?|c)": ("cup", 1),
        r"(\d+\.?\d*)\s*(tablespoons?|tbsp?|tbs?)": ("tbsp", 1),
        r"(\d+\.?\d*)\s*(teaspoons?|tsp?)": ("tsp", 1),
        r"(\d+\.?\d*)\s*(ounces?|oz)": ("oz", 1),
        r"(\d+\.?\d*)\s*(grams?|g)": ("g", 1),
        r"(\d+\.?\d*)\s*(pounds?|lbs?|lb)": ("lb", 1),
        r"(\d+\.?\d*)\s*(milliliters?|ml)": ("ml", 1),
        r"(\d+\.?\d*)\s*(liters?|l)": ("l", 1),
        r"(\d+\.?\d*)\s*(slices?|slice)": ("slice", 1),
        r"(\d+\.?\d*)\s*(pieces?|pcs?|pc)": ("piece", 1),
        r"(\d+\.?\d*)\s*(medium|small|large)": ("item", 1),
        r"(\d+\.?\d*)\s*whole": ("whole", 1),
        r"(\d+\.?\d*)\s*(?=\w+\s|$)": ("unit", 1),  # Fallback: just number
    }

    # Common ingredient aliases
    INGREDIENT_ALIASES = {
        "egg whites": "egg white",
        "egg white": "egg white",
        "eggs": "egg",
        "egg": "egg",
        "noodles": "pasta",
        "pasta": "pasta",
        "bread": "bread",
        "toast": "bread",
        "chicken": "chicken breast",
        "beef": "beef",
        "turkey": "turkey",
        "fish": "salmon",
        "salmon": "salmon",
        "tuna": "tuna",
        "rice": "rice",
        "brown rice": "rice",
        "white rice": "rice",
        "vegetables": "mixed vegetables",
        "veggies": "mixed vegetables",
        "broccoli": "broccoli",
        "carrots": "carrots",
        "mushrooms": "mushrooms",
        "olives": "olives",
        "avocado": "avocado",
        "honey": "honey",
        "oil": "olive oil",
        "olive oil": "olive oil",
        "butter": "butter",
        "milk": "milk",
        "cheese": "cheddar cheese",
        "yogurt": "greek yogurt",
        "salad": "mixed salad",
        "beans": "black beans",
        "oats": "oatmeal",
        "oatmeal": "oatmeal",
        "almonds": "almonds",
        "nuts": "almonds",
        "peanuts": "peanuts",
        "peanut butter": "peanut butter",
        "cereal": "cereal",
        "granola": "granola",
    }

    def parse_meal_description(self, description: str) -> List[Ingredient]:
        """
        Parse a natural language meal description into structured ingredients.

        Example:
            "I ate 4 egg whites, 1 cup noodles with olives and mushrooms, and 1 spoon honey"
            ->
            [
                Ingredient("egg white", 4, "unit", ...),
                Ingredient("pasta", 1, "cup", ...),
                Ingredient("olives", 1, "unit", ...),
                Ingredient("mushrooms", 1, "unit", ...),
                Ingredient("honey", 1, "tbsp", ...)
            ]
        """
        ingredients = []
        description = description.lower().strip()

        # Clean up the text
        description = self._clean_text(description)

        # Split on common delimiters
        parts = re.split(r"[,;]|and(?=\s)", description)

        for part in parts:
            part = part.strip()
            if not part:
                continue

            # Try to extract quantity + ingredient
            ingredient = self._parse_ingredient_part(part)
            if ingredient:
                ingredients.append(ingredient)

        return ingredients

    def _clean_text(self, text: str) -> str:
        """Clean up text by removing common phrase prefixes."""
        # Remove common meal intro phrases
        text = re.sub(r"^(i\s+)?(?:ate|had|consumed|ate a)\s+", "", text)
        text = re.sub(r"^(with|and)\s+", "", text)
        return text

    def _parse_ingredient_part(self, text: str) -> Ingredient:
        """Extract quantity and ingredient name from a text part."""
        text = text.strip()
        if not text:
            return None

        quantity, unit, remaining = self._extract_quantity(text)
        ingredient_name = remaining.strip()

        # Clean up ingredient name
        ingredient_name = self._normalize_ingredient(ingredient_name)

        if not ingredient_name:
            return None

        return Ingredient(
            name=ingredient_name, quantity=quantity, unit=unit, original_text=text
        )

    def _extract_quantity(self, text: str) -> Tuple[float, str, str]:
        """
        Extract quantity and unit from text.
        Returns (quantity, unit, remaining_text)
        """
        text = text.strip()

        # Try each pattern
        for pattern, (default_unit, _) in self.QUANTITY_PATTERNS.items():
            match = re.search(pattern, text)
            if match:
                try:
                    quantity = float(match.group(1))
                except (IndexError, ValueError):
                    quantity = 1.0

                unit = default_unit
                if len(match.groups()) > 1 and match.group(2):
                    unit = self._normalize_unit(match.group(2))

                # Remove matched part from text
                remaining = text[: match.start()] + text[match.end() :]
                remaining = remaining.strip()

                return quantity, unit, remaining

        # No quantity found
        return 1.0, "unit", text

    def _normalize_unit(self, unit: str) -> str:
        """Normalize unit names."""
        unit = unit.lower().strip()
        normalized = {
            "cup": "cup",
            "cups": "cup",
            "tbsp": "tbsp",
            "tablespoon": "tbsp",
            "tablespoons": "tbsp",
            "tbs": "tbsp",
            "tsp": "tsp",
            "teaspoon": "tsp",
            "teaspoons": "tsp",
            "oz": "oz",
            "ounce": "oz",
            "ounces": "oz",
            "g": "g",
            "gram": "g",
            "grams": "g",
            "lb": "lb",
            "lbs": "lb",
            "pound": "lb",
            "pounds": "lb",
            "ml": "ml",
            "milliliter": "ml",
            "milliliters": "ml",
            "l": "l",
            "liter": "l",
            "liters": "l",
            "slice": "slice",
            "slices": "slice",
            "piece": "piece",
            "pieces": "piece",
            "pc": "piece",
            "pcs": "piece",
        }
        return normalized.get(unit, "unit")

    def _normalize_ingredient(self, ingredient: str) -> str:
        """Normalize ingredient name using aliases."""
        ingredient = ingredient.lower().strip()

        # Remove common words
        ingredient = re.sub(r"(?:with|and|fresh)\s+", " ", ingredient)

        # Try exact aliases first
        if ingredient in self.INGREDIENT_ALIASES:
            return self.INGREDIENT_ALIASES[ingredient]

        # Try partial matches (longest match wins)
        matches = [
            (alias, normalized)
            for alias, normalized in self.INGREDIENT_ALIASES.items()
            if alias in ingredient
        ]

        if matches:
            # Return normalized form of longest matching alias
            longest_match = max(matches, key=lambda x: len(x[0]))
            return longest_match[1]

        # Return as-is if no alias found (ingredient name as provided)
        return ingredient if ingredient else None


# Singleton instance
parser = MealParser()


def parse_meal(description: str) -> List[Ingredient]:
    """Convenience function to parse meal description."""
    return parser.parse_meal_description(description)
