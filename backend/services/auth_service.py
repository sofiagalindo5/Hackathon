from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    if not isinstance(password, str):
        raise TypeError("password must be a string")
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password too long for bcrypt (max 72 bytes).")
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)
