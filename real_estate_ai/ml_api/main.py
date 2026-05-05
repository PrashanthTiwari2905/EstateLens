import os
import joblib
import pandas as pd
import numpy as np
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# --- APP INITIALIZATION ---
app = FastAPI(title="EstateLens ML Service", version="1.0")

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ARTIFACT LOADING ---
MODEL_PATH = "model.pkl"
FEATURES_PATH = "feature_names.pkl"

if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURES_PATH):
    print("⚠️ WARNING: Model artifacts not found. Please run train.py first.")
    model = None
    feature_names = []
else:
    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURES_PATH)
    explainer = shap.TreeExplainer(model)
    print("✅ ML Model and SHAP Explainer loaded and ready")

# --- DATA MODELS ---
class HouseInput(BaseModel):
    crim: float
    rm: float
    age: float
    dis: float
    tax: float
    ptratio: float
    lstat: float

class PredictionOutput(BaseModel):
    predicted_price: float
    confidence_range: List[float]
    top_factors: List[str]
    model_version: str

# --- BUSINESS LOGIC ---
def preprocess(data: HouseInput) -> pd.DataFrame:
    """Ensures input matches the feature ordering required by the model."""
    # Map back to feature names if necessary
    input_dict = {
        "crime_rate": data.crim,
        "avg_rooms": data.rm,
        "house_age": data.age,
        "distance_to_work": data.dis,
        "tax_rate": data.tax,
        "school_ratio": data.ptratio,
        "low_income_percent": data.lstat
    }
    df = pd.DataFrame([input_dict])
    df = df[feature_names]
    return df

def generate_explanations(df: pd.DataFrame) -> List[str]:
    """Generates human-readable SHAP factor strings."""
    shap_values = explainer.shap_values(df)[0]
    
    feature_impacts = []
    for i, name in enumerate(feature_names):
        val = df[name].values[0]
        impact = shap_values[i]
        feature_impacts.append({
            "name": name,
            "value": val,
            "impact": impact,
            "abs_impact": abs(impact)
        })
    
    top_3 = sorted(feature_impacts, key=lambda x: x["abs_impact"], reverse=True)[:3]
    
    factors = []
    for f in top_3:
        emoji = "✅" if f["impact"] > 0 else "❌"
        verb = "increased" if f["impact"] > 0 else "decreased"
        # Clean up names for display
        clean_name = f["name"].replace("_", " ").title()
        factors.append(f"{emoji} {clean_name} ({f['value']:.2f}) {verb} the price")
        
    return factors

# --- ENDPOINTS ---
@app.get("/health")
async def health():
    return {
        "status": "ok", 
        "model": "Random Forest", 
        "version": "1.0",
        "artifacts_loaded": model is not None
    }

@app.post("/predict/price", response_model=PredictionOutput)
async def predict(data: HouseInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Inference model not initialized.")
    
    try:
        # Preprocess
        df = preprocess(data)
        
        # Prediction (values are in $1000s in original dataset)
        raw_price = float(model.predict(df)[0])
        
        # Confidence Range (simplified +/- 8%)
        confidence_range = [
            raw_price * 0.92,
            raw_price * 1.08
        ]
        
        # Explainability
        factors = generate_explanations(df)
        
        return {
            "predicted_price": raw_price,
            "confidence_range": confidence_range,
            "top_factors": factors,
            "model_version": "1.0"
        }
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail="Error processing prediction request.")

# --- RUN BLOCK ---
if __name__ == "__main__":
    import uvicorn
    # Use environment PORT for deployment (e.g. Render/Railway)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
