import pandas as pd
import numpy as np

# Feature Mapping (Must match train.py)
FEATURE_MAP = {
    'CRIM': 'Crime Rate',
    'ZN': 'Land Zone',
    'INDUS': 'Business Proximity',
    'CHAS': 'River Proximity',
    'NOX': 'Nitric Oxide',
    'RM': 'Avg Rooms',
    'AGE': 'Property Age',
    'DIS': 'Job Center Proximity',
    'RAD': 'Highway Access',
    'TAX': 'Tax Rate',
    'PTRATIO': 'Student-Teacher Ratio',
    'B': 'Social Diversity',
    'LSTAT': 'Lower Status %'
}

# The specific 7 features requested in train.py prompt
SELECTED_FEATURES = ['Crime Rate', 'Avg Rooms', 'Property Age', 'Job Center Proximity', 'Tax Rate', 'Student-Teacher Ratio', 'Lower Status %']

def preprocess_input(data: dict) -> pd.DataFrame:
    """
    Normalizes the input dictionary into a pandas DataFrame.
    Handles renaming, feature selection, and missing values.
    """
    # 1. Create DataFrame
    df = pd.DataFrame([data])
    
    # 2. Rename keys to friendly names (case-insensitive keys from schema)
    # We'll normalize keys to UPPER for matching
    df.columns = [c.upper() for c in df.columns]
    
    renamed_cols = {}
    for raw_key, friendly_name in FEATURE_MAP.items():
        if raw_key in df.columns:
            renamed_cols[raw_key] = friendly_name
            
    df = df.rename(columns=renamed_cols)
    
    # 3. Ensure all 7 features exist
    for feat in SELECTED_FEATURES:
        if feat not in df.columns:
            df[feat] = np.nan
            
    # 4. Fill missing values (placeholder median approach)
    # In production, these medians should be saved from training set
    df = df.fillna(0) # Simple fallback for now
    
    # 5. Order columns
    df = df[SELECTED_FEATURES]
    
    return df
