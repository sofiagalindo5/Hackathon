import asyncio
from database import db

async def mongo_health():
    try:
        await db.command("ping")
        print("✅ MongoDB healthy")
    except Exception as e:
        print("❌ MongoDB unhealthy:", e)

asyncio.run(mongo_health())