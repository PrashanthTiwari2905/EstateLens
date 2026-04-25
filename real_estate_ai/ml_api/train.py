import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# --- CONFIGURATION ---
DATA_PATH = "data/housing.csv"
MODEL_PATH = "model.pkl"
FEATURES_PATH = "feature_names.pkl"

TARGET = "medv"
FEATURE_MAP = {
    'crim': 'crime_rate',
    'rm': 'avg_rooms',
    'age': 'house_age',
    'dis': 'distance_to_work',
    'tax': 'tax_rate',
    'ptratio': 'school_ratio',
    'lstat': 'low_income_percent'
}

def train():
    print("🚀 STEP 1: Loading & Previewing Data...")
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: Data file not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    print(f"Shape: {df.shape}")
    print(df.head())

    print("\n🚀 STEP 2: Feature Selection & Renaming...")
    # Select columns
    X = df[list(FEATURE_MAP.keys())]
    y = df[TARGET]
    
    # Rename to friendly names
    X = X.rename(columns=FEATURE_MAP)
    feature_names = list(X.columns)

    print("\n🚀 STEP 3: Handling Missing Values (Median Fill)...")
    X = X.fillna(X.median())

    print("\n🚀 STEP 4: Data Splitting (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("\n🚀 STEP 5: Training Random Forest (n=200)...")
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    print("\n🚀 STEP 6: Evaluating Model Performance...")
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"MAE:  {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R² Score: {r2:.4f}")

    print("\n🚀 STEP 7: Saving Artifacts...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(feature_names, FEATURES_PATH)
    print("✅ Model and feature names saved successfully!")

if __name__ == "__main__":
    train()
