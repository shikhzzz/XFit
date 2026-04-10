from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MealLogBase(BaseModel):
    description: str

class MealLogCreate(MealLogBase):
    pass

class MealLogResponse(MealLogBase):
    id: int
    calories: float
    protein: float
    carbs: float
    fats: float
    timestamp: datetime

    class Config:
        from_attributes = True

class WorkoutLogBase(BaseModel):
    activity: str
    duration_minutes: int

class WorkoutLogCreate(WorkoutLogBase):
    pass

class WorkoutLogResponse(WorkoutLogBase):
    id: int
    calories_burned: float
    timestamp: datetime

    class Config:
        from_attributes = True

class MealSuggestionRequest(BaseModel):
    description: str

class MealSuggestionResponse(BaseModel):
    description: str
    predicted_calories: float
    predicted_protein: float
    predicted_carbs: float
    predicted_fats: float
    inference_time_ms: float
    model_name: str
    hardware_target: str

class ChatContext(BaseModel):
    name: str = "Guest"
    goal: str = "Maintenance"
    calories_target: float = 2500
    calories_consumed: float = 0

class ChatRequest(BaseModel):
    message: str
    context: ChatContext

class ChatResponse(BaseModel):
    response: str
    inference_time_ms: float
