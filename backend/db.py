import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv



MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "notes_app")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is missing. Add it to backend/.env")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]