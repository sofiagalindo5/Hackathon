import asyncio
from database import db

async def test_db():
    collections = await db.list_collection_names()
    print("✅ Connected to MongoDB")
    print("Collections:", collections)

asyncio.run(test_db())