from typing import Optional

from pydantic import BaseModel, EmailStr

# Pydantic Models of users for FastAPI

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None
    phone: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfileOut(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None


class UserProfileUpdate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None

