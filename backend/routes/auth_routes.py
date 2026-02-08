from fastapi import APIRouter, HTTPException
from models.user_model import UserCreate, UserLogin
from services.auth_service import hash_password, verify_password
from ..database import users_collection

router = APIRouter()

# POST a user
@router.post("/signup")
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    new_user = {
        "email": user.email,
        "password": hashed_pw
    }

    await users_collection.insert_one(new_user)

    return {"message": "Signup successful"}

# POST (Validate a user)
@router.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful", "email": db_user["email"]}