import joblib
import os
import pandas as pd
import numpy as np
from ..utils.preprocessing import preprocess_input

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "model.pkl")

class PredictionService:
    def __init__(self):
        self.model = None
        self.version = "1.0.0-RandomForest"
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"Error loading model: {e}")

    def predict_price(self, data: dict) -> dict:
        if not self.model:
            self._load_model()
            if not self.model:
                return {"error": "Model not available"}

        # 1. Preprocess
        X = preprocess_input(data)
        
        # 2. Predict
        prediction = self.model.predict(X)[0]
        
        # 3. Confidence range (simplified +/- 5% for demo)
        confidence_delta = prediction * 0.05
        
        return {
            "predicted_price": float(prediction),
            "confidence_range": [
                float(prediction - confidence_delta),
                float(prediction + confidence_delta)
            ],
            "model_version": self.version
        }

prediction_service = PredictionService()
