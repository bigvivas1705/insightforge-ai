from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

# --- Request body models ---
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- Register endpoint ---
@router.post("/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Creates a new user account."""

    # Check if username already exists
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken.")

    # Create new user with hashed password
    new_user = User(
        username=request.username,
        email=request.email,
        hashed_password=hash_password(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Account created successfully!", "username": new_user.username}

# --- Login endpoint ---
@router.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Logs in a user and returns a JWT token."""

    # Find user in database
    user = db.query(User).filter(User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Verify password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Generate JWT token
    token = create_access_token(data={"sub": user.username})

    return {"access_token": token, "token_type": "bearer"}