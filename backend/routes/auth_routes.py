from fastapi import APIRouter, HTTPException
from backend.models.user_model import UserCreate, UserLogin
from backend.services.auth_service import hash_password, verify_password
from backend.database import users_collection

router = APIRouter(prefix="/auth", tags=["auth"])

# POST a user
@router.post("/signup")
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    print("SIGNUP password bytes:", len(user.password.encode("utf-8")))
    print("SIGNUP password preview:", repr(user.password[:40]))
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
    print("LOGIN ATTEMPT:", user.email, "FOUND:", bool(db_user))
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful", "email": db_user["email"]}