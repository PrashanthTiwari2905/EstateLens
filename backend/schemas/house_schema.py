from pydantic import BaseModel
from typing import List

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
