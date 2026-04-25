import shap
import pandas as pd
import numpy as np
import os
from .prediction_service import prediction_service
from ..utils.preprocessing import preprocess_input

class ExplainService:
    def __init__(self):
        self.explainer = None

    def _init_explainer(self):
        if prediction_service.model:
            self.explainer = shap.TreeExplainer(prediction_service.model)

    def explain_prediction(self, data: dict) -> list[str]:
        if not self.explainer:
            self._init_explainer()
        
        if not self.explainer:
            return ["Explanation currently unavailable"]

        # 1. Preprocess
        X = preprocess_input(data)
        
        # 2. Get SHAP values
        shap_values = self.explainer.shap_values(X)
        
        # Handle index for single prediction
        if isinstance(shap_values, list):
            # For multi-class RF, but here it's regressor
            vals = shap_values[0]
        else:
            vals = shap_values[0]

        # 3. Pair values with feature names
        feature_names = X.columns
        contributions = []
        for i, name in enumerate(feature_names):
            contributions.append((name, vals[i]))
            
        # 4. Sort by absolute impact
        contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        
        # 5. Build human-readable factors (Top 3)
        factors = []
        for name, impact in contributions[:3]:
            direction = "increases" if impact > 0 else "decreases"
            factors.append(f"{name} {direction} the estimated value.")
            
        return factors

explain_service = ExplainService()
