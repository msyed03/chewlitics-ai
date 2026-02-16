from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
import schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


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


@app.post("/meals/", response_model=schemas.MealResponse)
def create_meal(meal: schemas.MealCreate, db: Session = Depends(get_db)):
    db_meal = models.Meal(food_label=meal.food_label, calories=meal.calories)
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal
