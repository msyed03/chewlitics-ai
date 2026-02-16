from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    food_label = Column(String, index=True)
    calories = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
