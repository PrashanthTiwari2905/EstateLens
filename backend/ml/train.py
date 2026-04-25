import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Configuration
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "housing.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "feature_names.pkl")

# Feature Mapping
FEATURE_MAP = {
    'crim': 'Crime Rate',
    'rm': 'Avg Rooms',
    'age': 'Property Age',
    'dis': 'Job Center Proximity',
    'tax': 'Tax Rate',
    'ptratio': 'Student-Teacher Ratio',
    'lstat': 'Lower Status %'
}

def train_model():
    print("🚀 Starting training...")
    
    # 1. Load Data
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: Data file not found at {DATA_PATH}")
        return
        
    df = pd.read_csv(DATA_PATH)
    
    # 2. Select Features
    X = df[list(FEATURE_MAP.keys())]
    y = df['medv']
    
    # 3. Rename to friendly names
    X = X.rename(columns=FEATURE_MAP)
    feature_names = list(X.columns)
    
    # 4. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 5. Train Random Forest
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    
    # 6. Evaluation
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)
    
    print("\n📈 Model Evaluation:")
    print(f"MAE:  ${mae*1000:,.2f}")
    print(f"RMSE: ${rmse*1000:,.2f}")
    print(f"R²:   {r2:.4f}")
    
    # 7. Save Artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(feature_names, FEATURES_PATH)
    print(f"\n✅ Model saved to {MODEL_PATH}")
    print(f"✅ Features saved to {FEATURES_PATH}")

if __name__ == "__main__":
    train_model()
