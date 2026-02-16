from pydantic import BaseModel
from datetime import datetime


class MealCreate(BaseModel):
    food_label: str
    calories: float


class MealResponse(MealCreate):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
