import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database.mongo import connect_to_mongo, close_mongo_connection
from .routes import auth, predict
from .services.prediction_service import prediction_service

# --- LOGGING CONFIGURATION ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# --- LIFESPAN EVENT HANDLER ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing Real Estate AI API...")
    
    # 1. Connect to MongoDB
    try:
        await connect_to_mongo()
        logger.info("✅ MongoDB Connection Successful")
    except Exception as e:
        logger.error(f"❌ MongoDB Connection Failed: {e}")
    
    # 2. Ensure Prediction Service is ready (triggers model loading)
    if prediction_service.model:
        logger.info(f"✅ ML Model Loaded Successfully (Version: {prediction_service.version})")
    else:
        logger.warning("⚠️ ML Model could not be loaded. Predictions will fail.")
    
    logger.info("🚀 API is ready to handle requests!")
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down API...")
    await close_mongo_connection()
    logger.info("👋 Security first: Database connections closed.")

# --- FASTAPI INITIALIZATION ---
app = FastAPI(
    title="EstateLens AI API",
    description="AI-powered house price prediction with SHAP explainability and JWT security.",
    version="2.0.0",
    lifespan=lifespan
)

# --- CORS MIDDLEWARE ---
origins = [
    "http://localhost:5173",           # Vite dev server
    "http://localhost:5174",           # Case where 5173 is busy
    "http://localhost:3000",           # Alternative frontend port
    "https://estate-lens-three.vercel.app", # User's actual production frontend
    "https://your-app.vercel.app",     # Placeholder
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---
# Include routers with requested prefixes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])

# --- ROOT ENDPOINT ---
@app.get("/")
async def root():
    """
    Root endpoint serving API meta-information.
    """
    return {
        "app": "EstateLens AI API",
        "version": "2.0.0",
        "status": "online",
        "database": "connected" if db.client else "disconnected",
        "ml_engine": prediction_service.version,
        "documentation": "/docs"
    }

# --- RUN LOGIC ---
if __name__ == "__main__":
    import uvicorn
    # uvicorn main:app --reload --port 8000
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
