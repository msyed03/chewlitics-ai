# Nutrition Logging Workflow Implementation Summary

## Overview
Implemented an MVP AI-powered nutrition logging system that allows users to describe meals in natural language, and the system parses ingredients and aggregates nutrition data.

---

## Architecture Overview

### Backend (Python FastAPI)
- **Layers**: API → Meal Parser → Nutrition Service → Database
- **Modular Design**: Parser can be upgraded from rule-based to LLM without changing API contracts

### Frontend (React)
- Meal Scanner page with natural language input
- Real-time parsing and ingredient breakdown
- Save meals to database
- Photo scan UI marked as "Coming Soon"

---

## Implementation Details

### 1. Parsing Approach (MVP - Rule-Based)

**File**: `backend/meal_parser.py`

**How it works**:
- Regex-based extraction of quantities, units, and ingredient names
- Supports common meal description patterns:
  - "4 egg whites" → (quantity: 4, unit: unit, ingredient: egg white)
  - "1 cup noodles" → (quantity: 1, unit: cup, ingredient: pasta)
  - "1 tbsp honey" → (quantity: 1, unit: tbsp, ingredient: honey)

**Pattern Coverage**:
- Quantities: numbers with decimals (2, 2.5, etc.)
- Units: cup, tbsp, tsp, oz, g, gram, lb, ml, l, slice, piece, etc.
- Ingredient aliases: Maps common names to standardized format
  - "egg whites" → "egg white"
  - "noodles" → "pasta"
  - "olive oil" → "olive oil"
  - 100+ common food items pre-mapped

**Example Processing**:
```
Input: "I ate 4 egg whites, 1 cup noodles with olives and mushrooms, 1 tbsp honey"

Parsed Ingredients:
1. egg white × 4 units
2. pasta × 1 cup
3. olives × 1 unit
4. mushrooms × 1 unit
5. honey × 1 tbsp (normalized to tbsp)
```

**Future Upgrades**:
- Replace with LLM (e.g., GPT-4 with function calling)
- Use spaCy NLP for advanced entity extraction
- Add confidence scores

---

### 2. Nutrition Aggregation Logic

**File**: `backend/nutrition_service.py`

**Dual-Source Strategy**:
1. **Primary**: USDA FoodData Central API via `requests` library
   - Query: `{ingredient_name}` → Finds closest match
   - Extracts: calories, protein, carbs, fat, fiber per 100g
   - API Key: `USDA_API_KEY` env var (fallback: `DEMO_KEY`)

2. **Fallback**: Local nutrition database (100+ common foods)
   - Pre-populated with per-100g baseline values
   - Used when API unavailable or for speed
   - Example: "egg white" → {calories: 17, protein: 3.6, carbs: 0.4, fat: 0.1, fiber: 0}

**Quantity Scaling**:
- All quantities normalized to grams:
  - 1 cup ≈ 240g
  - 1 tbsp ≈ 15g
  - 1 oz ≈ 28g
  - 1 lb ≈ 454g
  - etc.
- Nutrition scaled: `(ingredient_nutrition * quantity_grams) / 100`

**Aggregation**:
- Sum calories, protein, carbs, fat, fiber across all ingredients
- Rounded to 2 decimals for display

---

## Backend Files Changed

### New Files
1. **`backend/meal_parser.py`** (246 lines)
   - `MealParser` class with rule-based parsing logic
   - `parse_meal()` function as entry point
   - Ingredient data structure with quantity/unit/name

2. **`backend/nutrition_service.py`** (187 lines)
   - `NutritionService` class with USDA API integration
   - Quantity-to-grams conversion
   - Local nutrition database fallback
   - `NutritionData` class for nutrition info

### Modified Files
1. **`backend/main.py`**
   - Added CORS support via `CORSMiddleware`
   - New endpoints:
     - `POST /nutrition/parse-meal` - Parse meal description
     - `POST /meals` - Save meal to database
     - `GET /meals` - Retrieve all meals
     - `GET /analytics/daily` - Get today's nutrition totals

2. **`backend/models.py`**
   - Extended `Meal` model: added protein, carbs, fat, fiber, meal_description, user_id
   - New `MealIngredient` model: tracks individual ingredient nutrition
   - Relationship: Meal → Many MealIngredients

3. **`backend/schemas.py`**
   - New request schemas:
     - `ParseMealRequest`: {"meal_description": str}
     - `MealCreate`: Full meal with ingredients
   - New response schemas:
     - `ParseMealResponse`: {ingredients[], total_nutrition{}}
     - `MealResponse`: Full meal with timestamps
     - `DailyNutritionSummary`: Today's totals
     - `AnalyticsResponse`: Daily summary + meals list

4. **`backend/database.py`**
   - Made DATABASE_URL configurable via env var

5. **`backend/requirements.txt`**
   - Added: `requests`, `python-dotenv`, `fastapi-cors`

---

## Frontend Files Changed

### Modified Files
1. **`frontend/src/pages/MealScanner.js`** (Complete Rewrite)
   - **New Section**: "Describe Your Meal" textarea input (top)
   - **New Functionality**:
     - `handleParseMeal()`: POST to `/nutrition/parse-meal`
     - `handleSaveMeal()`: POST to `/meals`
     - Real-time ingredient breakdown display
     - Total nutrition summary card
     - Error handling and loading states
   - **Preserved UI**: AI Photo Scan marked as "Coming Soon"
   - **Examples**: 4 clickable meal description examples
   - **How It Works**: Workflow step cards (4 steps)

**Key Features**:
- Textarea with placeholder example
- Real-time parsing results showing ingredient breakdown
- Per-ingredient nutrition display (cal, protein, carbs, fat)
- Total nutrition aggregation
- Save meal button with loading states
- Error messages for API failures
- "Coming Soon" badge for future photo scan

---

## API Endpoints

### 1. Parse Meal (POST /nutrition/parse-meal)
```json
Request:
{
  "meal_description": "I ate 4 egg whites, 1 cup noodles with olives and mushrooms, 1 tbsp honey"
}

Response:
{
  "ingredients": [
    {
      "ingredient_name": "egg white",
      "quantity": 4,
      "unit": "unit",
      "calories": 68,
      "protein": 14.4,
      "carbs": 1.6,
      "fat": 0.4,
      "fiber": 0
    },
    {
      "ingredient_name": "pasta",
      "quantity": 1,
      "unit": "cup",
      "calories": 314.4,
      "protein": 12,
      "carbs": 60,
      "fat": 2.64,
      "fiber": 4.32
    },
    ...
  ],
  "total_nutrition": {
    "calories": 475.82,
    "protein": 35.25,
    "carbs": 73.40,
    "fat": 12.85,
    "fiber": 2.42
  }
}
```

### 2. Save Meal (POST /meals)
```json
Request:
{
  "food_label": "I ate 4 egg whites, 1 cup...",
  "meal_description": "I ate 4 egg whites, 1 cup noodles with olives and mushrooms, 1 tbsp honey",
  "calories": 475.82,
  "protein": 35.25,
  "carbs": 73.40,
  "fat": 12.85,
  "fiber": 2.42,
  "ingredients": [...]
}

Response:
{
  "id": 1,
  "user_id": "default_user",
  "food_label": "...",
  "meal_description": "...",
  "calories": 475.82,
  "protein": 35.25,
  "carbs": 73.40,
  "fat": 12.85,
  "fiber": 2.42,
  "timestamp": "2025-04-11T12:30:00",
  "ingredients": [...]
}
```

### 3. Get All Meals (GET /meals)
Returns all meals with full details (desc order by timestamp)

### 4. Get Daily Analytics (GET /analytics/daily)
```json
Response:
{
  "daily_summary": {
    "date": "2025-04-11",
    "total_calories": 1850.5,
    "total_protein": 125.3,
    "total_carbs": 210.5,
    "total_fat": 52.8,
    "total_fiber": 15.2,
    "meals_logged": 3
  },
  "meals": [...]
}
```

---

## How to Test

### Setup (First Time)
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install

# Create .env files
cp .env.example backend/.env
cp .env.example frontend/.env.local
# Edit them if needed (USDA_API_KEY, API_URL)
```

### Run Backend
```bash
cd backend
python -m uvicorn main:app --reload
# Server starts at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Run Frontend
```bash
cd frontend
npm start
# App at http://localhost:3000
```

### Test Meal Parsing

**Via React UI**:
1. Go to "Log Your Meal" page
2. Enter a meal description (e.g., "2 eggs, 1 toast, coffee with milk")
3. Click "Analyze Meal"
4. See parsed ingredients with nutrition
5. Click "Save Meal"
6. Check "Meal History" or "Dashboard" for logged data

**Via API (curl)**:
```bash
curl -X POST http://localhost:8000/nutrition/parse-meal \
  -H "Content-Type: application/json" \
  -d '{"meal_description": "I ate 2 eggs, 1 toast, and 1 apple"}'
```

**Test Examples to Try**:
```
1. "2 eggs, 1 toast with butter, and coffee with milk"
2. "4 egg whites, 1 cup noodles with olives and mushrooms, 1 spoon honey"
3. "Grilled chicken breast, 1.5 cups rice, broccoli, and 1 tbsp olive oil"
4. "Tuna sandwich with lettuce, 1 apple, and almonds"
```

---

## Testing Checklist

- [ ] Parsing extracts all ingredients correctly
- [ ] Units are normalized (tbsp → tbsp, etc.)
- [ ] Quantities are scaled properly
- [ ] Nutrition data is fetched (USDA or local fallback)
- [ ] Total calories/macros are aggregated correctly
- [ ] Meals are saved to database
- [ ] Meal History shows logged meals
- [ ] Dashboard shows today's totals
- [ ] CORS works (frontend ↔ backend)
- [ ] Error handling works (invalid input, API failures)

---

## MVP Limitations & Future Work

### Current Limitations
- **Parser**: Rule-based only, doesn't handle complex descriptions well
- **User**: All meals go to "default_user" (no auth yet)
- **Photo Scan**: UI only, no CV implementation
- **Portions**: Quantity conversion simplified (no food-specific density)
- **API**: Free DEMO_KEY limited (100 requests/day)

### Future Enhancements
1. **Parsing**: Upgrade to LLM (GPT-4) with function calling
2. **Auth**: User accounts with JWT tokens
3. **Photo**: Integrate computer vision (Google Vision API or local CV model)
4. **Portions**: Food-specific volume-to-weight lookup tables
5. **Customization**: User-specific nutrition goals and preferences
6. **History**: Weekly/monthly analytics and trends
7. **Recipes**: Smart suggestions based on past meals
8. **Barcode**: Scan product barcodes for instant nutrition

---

## Key Architectural Decisions

1. **Rule-Based Parser (MVP)**
   - Why: Fast, reliable, no ML dependencies
   - When to upgrade: Once we need 95%+ accuracy on diverse inputs

2. **Dual Nutrition Source**
   - Why: USDA API may fail; local cache ensures always available
   - Scalable: Can add more APIs (NCCDB, food company databases)

3. **Modular Design**
   - Why: Easy to swap parsers, nutrition sources, or storage
   - No tight coupling between layers

4. **Normalized Quantities**
   - Why: Standardizes nutrition aggregation
   - Trade-off: Simplified conversions for MVP

5. **CORS Enabled**
   - Why: Frontend and backend may be on different ports/domains
   - Production: Restrict to specific origins

---

## Files Reference

**Backend Core**:
- `main.py` - API endpoints
- `models.py` - Database schema
- `schemas.py` - Request/response validation
- `database.py` - DB connection
- `meal_parser.py` - Text parsing logic
- `nutrition_service.py` - Nutrition lookup & aggregation

**Frontend Core**:
- `src/pages/MealScanner.js` - Main meal logging UI
- `src/components/ui/*` - Reusable UI components
- `src/constants/theme.js` - Design tokens

---

## Questions?

For detailed code walkthroughs or extending functionality, refer to inline comments in:
- `meal_parser.py` - Parsing algorithms
- `nutrition_service.py` - Quantity conversion & USDA API
- `MealScanner.js` - Frontend state management & API calls
