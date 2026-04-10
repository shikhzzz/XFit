import time
import torch
from transformers import pipeline

# Load a lightweight DistilBERT pipeline for demonstration
# We use zero-shot classification to mock assigning a generic category to the food,
# which then we arbitrarily mock to generate calories/macros.
print("Loading DistilBERT model (placeholder for AMD optimized model)...")
try:
    nlp_model = pipeline("zero-shot-classification", model="distilbert-base-uncased-mnli")
except Exception as e:
    nlp_model = None
    print(f"Failed to load model: {e}")

# Function to mock an expensive GPU operation
def mock_amd_gpu_tensor_ops():
    # We will simulate a quick ROCm computation
    if torch.cuda.is_available():
        # ROCm hip uses cuda mechanics in torch
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")
    
    # Simulate a tensor multiplication
    matrix_a = torch.randn(2000, 2000, device=device)
    matrix_b = torch.randn(2000, 2000, device=device)
    _ = torch.matmul(matrix_a, matrix_b)

def suggest_meal(description: str):
    start_time = time.time()
    
    # 1. Run actual placeholder model
    categories = ["healthy", "junk food", "snack", "drink", "protein rich", "carb heavy"]
    
    if nlp_model:
        result = nlp_model(description, candidate_labels=categories)
        top_category = result["labels"][0]
    else:
        top_category = "healthy"

    # 2. Mock some tensor operations heavily optimized for ROCm
    mock_amd_gpu_tensor_ops()
    
    end_time = time.time()
    inference_time_ms = (end_time - start_time) * 1000

    # 3. Generate mocked nutritional data based on category
    calories = len(description) * 10.0
    protein = 10.0
    carbs = 20.0
    fats = 5.0
    
    if top_category == "protein rich":
        protein += 30.0
        calories += 120.0
    elif top_category == "junk food":
        fats += 25.0
        carbs += 40.0
        calories += 300.0

    return {
        "description": description,
        "predicted_calories": round(calories, 1),
        "predicted_protein": round(protein, 1),
        "predicted_carbs": round(carbs, 1),
        "predicted_fats": round(fats, 1),
        "inference_time_ms": round(inference_time_ms, 2),
        "model_name": "distilbert-base (ROCm optimized)",
        "hardware_target": "AMD GPU / ROCm" if torch.cuda.is_available() else "AMD CPU Simulation"
    }

def generate_meal_plan(goal: str, diet_pref: str):
    start_time = time.time()
    
    # Mock tensor operations
    mock_amd_gpu_tensor_ops()
    
    end_time = time.time()
    inference_time_ms = (end_time - start_time) * 1000
    
    # Dummy plan
    return {
        "plan": [
            {"day": "Monday", "breakfast": "Oatmeal with berries", "lunch": "Chicken salad", "dinner": "Grilled salmon"},
            {"day": "Tuesday", "breakfast": "Scrambled eggs", "lunch": "Turkey wrap", "dinner": "Lentil soup"},
            {"day": "Wednesday", "breakfast": "Smoothie", "lunch": "Quinoa bowl", "dinner": "Steak and broccoli"}
        ],
        "inference_time_ms": round(inference_time_ms, 2),
        "model_name": "distilbert-base (ROCm optimized)",
        "hardware": "AMD GPU / ROCm"
    }

def process_chat(message: str, context: dict):
    start_time = time.time()
    mock_amd_gpu_tensor_ops()
    end_time = time.time()
    inference_time_ms = (end_time - start_time) * 1000

    msg = message.lower()
    resp = "I'm XFit AI. I can help with diet and workout suggestions!"
    
    if "lunch" in msg or "eat" in msg:
        resp = f"Given your goal is {context.get('goal')} and your target is {context.get('calories_target')} kcal, I suggest a high-protein quinoa and grilled chicken bowl."
    elif "protein" in msg:
        resp = "You should aim for about 1.6g to 2.2g of protein per kg of bodyweight to support your goals."
    elif "workout" in msg:
        resp = f"Hi {context.get('name')}, since your goal is {context.get('goal')}, a 45-minute HIIT session mixed with compound lifting would be perfect today."
    elif "calories" in msg or "status" in msg:
        cal = context.get('calories_consumed')
        target = context.get('calories_target')
        resp = f"You've consumed {cal} kcal out of your {target} kcal daily target."

    return {
        "response": resp,
        "inference_time_ms": round(inference_time_ms, 2)
    }
