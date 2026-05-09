from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from ..schemas.house_schema import HouseInput, PredictionOutput
from ..services.prediction_service import prediction_service
from ..services.explain_service import explain_service
from ..utils.jwt_handler import get_current_user
from ..database.mongo import db
from datetime import datetime

router = APIRouter()

@router.post("/price", response_model=PredictionOutput)
async def predict_price(data: HouseInput, current_user: dict = Depends(get_current_user)):
    # 0. Validation
    if data.sqft <= 0:
        raise HTTPException(status_code=400, detail="Square footage must be greater than zero.")
    
    # 1. Get Prediction
    result = prediction_service.predict_price(data.dict())
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    # 2. Get Explanation
    factors = explain_service.explain_prediction(data.dict())
    
    # 3. Save to MongoDB if user is logged in
    try:
        prediction_doc = {
            "user_email": current_user["sub"],
            "input_data": data.dict(),
            "predicted_price": result["predicted_price"],
            "confidence_range": result["confidence_range"],
            "top_factors": factors,
            "timestamp": datetime.utcnow()
        }
        await db.db.predictions.insert_one(prediction_doc)
    except Exception as e:
        print(f"Error saving prediction: {e}")

    # 4. Combine result
    output = PredictionOutput(
        predicted_price=result["predicted_price"],
        confidence_range=result["confidence_range"],
        top_factors=factors,
        model_version=result["model_version"]
    )
    
    return output

@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    # Fetch last 10 predictions for this user
    cursor = db.db.predictions.find(
        {"user_email": current_user["sub"]}
    ).sort("timestamp", -1).limit(10)
    
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
        
    return history

@router.get("/health")
async def health_check():
    return {
        "status": "active",
        "model_loaded": prediction_service.model is not None,
        "version": prediction_service.version
    }
