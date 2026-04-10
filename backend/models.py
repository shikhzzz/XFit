from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fats = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    activity = Column(String, index=True)
    duration_minutes = Column(Integer)
    calories_burned = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
