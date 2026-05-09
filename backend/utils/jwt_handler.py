import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("SECRET_KEY", "your_super_secret_key_change_this")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Passlib CryptContext for password hashing
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# OAuth2 context for extracting token from the 'Authorization' header
# tokenUrl defines the endpoint that returns the token (used by Swagger UI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# --- PASSWORD FUNCTIONS ---

def hash_password(password: str) -> str:
    """Creates a secure bcrypt hash of the provided password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies that the plain-text password matches the stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)

# --- JWT FUNCTIONS ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a secure JSON Web Token (JWT).
    Adds an expiration timestamp (exp claim) and encodes the data.
    """
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Sign and encode the JWT using the secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and validates a JWT.
    
    Flow:
    1. Check signature against SECRET_KEY.
    2. Check 'exp' claim to ensure token hasn't expired.
    3. Return payload if valid, else catch exceptions and return None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Ensure the 'sub' (subject, e.g., user email) is present
        return payload if payload.get("sub") else None
    except JWTError:
        # Catch errors: invalid signature, expired token, etc.
        return None

# --- FASTAPI DEPENDENCY ---

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Dependency function to protect routes.
    
    1. Extracts token using OAuth2PasswordBearer.
    2. Decodes token to get user information.
    3. Raises 401 Unauthorized if validation fails.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    # Return the payload (contains user info like email in 'sub')
    return payload
