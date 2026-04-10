from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, Base, get_db
import models
import schemas
import ai_engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="XFit API", version="1.0.0")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to XFit API powered by AMD ROCm."}

@app.post("/api/ai/suggest_meal", response_model=schemas.MealSuggestionResponse)
def suggest_meal(request: schemas.MealSuggestionRequest):
    result = ai_engine.suggest_meal(request.description)
    return result

@app.post("/api/ai/plan_meals")
def plan_meals(goal: str = "maintenance", diet_pref: str = "none"):
    result = ai_engine.generate_meal_plan(goal, diet_pref)
    return result

@app.post("/api/log_meal", response_model=schemas.MealLogResponse)
def log_meal(meal: schemas.MealLogCreate, db: Session = Depends(get_db)):
    # Run through AI to get macros
    suggestion = ai_engine.suggest_meal(meal.description)
    
    db_meal = models.MealLog(
        description=meal.description,
        calories=suggestion["predicted_calories"],
        protein=suggestion["predicted_protein"],
        carbs=suggestion["predicted_carbs"],
        fats=suggestion["predicted_fats"]
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal

@app.get("/api/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    meals = db.query(models.MealLog).all()
    workouts = db.query(models.WorkoutLog).all()
    
    total_calories_in = sum([m.calories for m in meals])
    total_calories_burned = sum([w.calories_burned for w in workouts])
    
    return {
        "calories_intake": total_calories_in,
        "calories_burned": total_calories_burned,
        "meals_logged": len(meals),
        "workouts_logged": len(workouts)
    }

@app.post("/api/ai/chat", response_model=schemas.ChatResponse)
def ai_chat(request: schemas.ChatRequest):
    ctx = {
        "name": request.context.name,
        "goal": request.context.goal,
        "calories_target": request.context.calories_target,
        "calories_consumed": request.context.calories_consumed
    }
    result = ai_engine.process_chat(request.message, ctx)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
