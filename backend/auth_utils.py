import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env")


# Password hashing


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


# JWT configuration

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET not set in environment variables")


# Token helpers

def create_access_token(user_id: str) -> str:
    """
    Create a signed JWT access token.

    Payload:
    - sub: user id (string)
    - exp: expiration datetime
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return token

def decode_access_token(token: str) -> str:
    """
    Decode and validate a JWT access token.

    Returns:
        user_id (str) from the token subject
    Raises:
        JWTError if invalid or expired
    """
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM]
    )

    user_id = payload.get("sub")
    if user_id is None:
        raise JWTError("Token missing subject")

    return user_id