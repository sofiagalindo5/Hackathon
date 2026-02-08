from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)

# Database
db = client["notes_app"]

# Collections
users_collection = db["users"]
classes_collection = db["classes"]

