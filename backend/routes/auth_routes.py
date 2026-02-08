from fastapi import APIRouter, HTTPException, Query
from backend.models.user_model import UserCreate, UserLogin, UserProfileOut, UserProfileUpdate
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

    return {
        "message": "Login successful",
        "email": db_user.get("email"),
        "name": db_user.get("name"),
        "phone": db_user.get("phone"),
    }


@router.get("/profile", response_model=UserProfileOut)
async def get_profile(email: str = Query(...)):
    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": db_user.get("email"),
        "name": db_user.get("name"),
        "phone": db_user.get("phone"),
    }


@router.put("/profile", response_model=UserProfileOut)
async def update_profile(
    profile: UserProfileUpdate,
    email: str = Query(...),
):
    if profile.email != email:
        existing = await users_collection.find_one({"email": profile.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

    result = await users_collection.update_one(
        {"email": email},
        {"$set": {
            "email": profile.email,
            "name": profile.name,
            "phone": profile.phone,
        }},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": profile.email,
        "name": profile.name,
        "phone": profile.phone,
    }