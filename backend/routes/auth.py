from fastapi import APIRouter, HTTPException, Depends, status
from ..schemas.auth_schema import UserRegister, UserLogin, TokenResponse, UserResponse
from ..utils.jwt_handler import hash_password, verify_password, create_access_token, get_current_user
from ..database.mongo import db
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = await db.db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password and prepare user document
    hashed_password = hash_password(user_data.password)
    user_dict = {
        "full_name": user_data.full_name,
        "email": user_data.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    # Save to MongoDB
    result = await db.db.users.insert_one(user_dict)
    
    return {"message": "Account created!", "id": str(result.inserted_id), "email": user_data.email}

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Find user
    user = await db.db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    access_token = create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user["full_name"],
        "user_email": user["email"]
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    # Find user details from DB using sub (email) from payload
    user = await db.db.users.find_one({"email": current_user["sub"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Map MongoDB _id (ObjectId) to string 'id' for the response
    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
        "email": user["email"],
        "created_at": user["created_at"]
    }
