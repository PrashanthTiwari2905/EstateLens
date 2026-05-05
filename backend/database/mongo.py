from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "estatelens")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(MONGO_URI)
    db.db = db.client[DB_NAME]
    print(f"Connected to MongoDB: {DB_NAME}")

async def close_mongo_connection():
    db.client.close()
    print("Closed MongoDB connection")
