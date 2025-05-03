from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.core.security import authenticate_user, create_access_token, get_password_hash, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models.blog import User
from app.schemas.blog import UserCreate, User as UserSchema, Token, StandardResponse, UserLogin

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@router.post("/register", response_model=StandardResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {"user_id": db_user.id}
    }

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # The OAuth2PasswordRequestForm expects username field, but we're using email
    # So we need to authenticate using the username field as email
    logger.info(f"Token login attempt with username: {form_data.username}")
    
    # First try to authenticate with email as username
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        # If authentication with email fails, try to find by username
        db_user = db.query(User).filter(User.username == form_data.username).first()
        if db_user:
            if verify_password(form_data.password, db_user.hashed_password):
                user = db_user
    
    if not user:
        logger.error(f"Failed login attempt with username: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    logger.info(f"Successful token login for user: {user.username}, admin: {user.is_admin}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=StandardResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Log which credential is being used
    if login_data.email:
        logger.info(f"Login attempt with email: {login_data.email}")
        # Try to get user by email
        user = db.query(User).filter(User.email == login_data.email).first()
    elif login_data.username:
        logger.info(f"Login attempt with username: {login_data.username}")
        # Try to get user by username
        user = db.query(User).filter(User.username == login_data.username).first()
    else:
        # This case should be caught by the validator in UserLogin schema
        logger.error("Login attempt without email or username")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username is required",
        )
    
    if user:
        logger.info(f"User found: {user.username}")
        if verify_password(login_data.password, user.hashed_password):
            logger.info(f"Password verified for user: {user.username}")
            
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.username},
                expires_delta=access_token_expires
            )
            
            logger.info(f"Successful login for user: {user.username}, admin: {user.is_admin}")
            return {
                "success": True,
                "message": "Login successful",
                "data": {
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "is_admin": user.is_admin
                    },
                    "access_token": access_token,
                    "token_type": "bearer"
                }
            }
        else:
            logger.error(f"Invalid password for user: {user.username}")
    else:
        credential_type = "email" if login_data.email else "username"
        credential_value = login_data.email if login_data.email else login_data.username
        logger.error(f"No user found with {credential_type}: {credential_value}")
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect credentials",
    )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    # In a real app, you would fetch the user from the database here
    return token_data 