from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import db

# IMPORTANT: import the router
from routes.upload_routes import router as upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount upload routes under /api
app.include_router(upload_router, prefix="/api", tags=["upload"])

@app.get("/")
def health():
    return {"status": "Backend running"}

@app.get("/db-test")
async def db_test():
    result = await db.test_collection.insert_one({"hello": "world"})
    doc = await db.test_collection.find_one({"_id": result.inserted_id})

    doc["_id"] = str(doc["_id"])
    return {"ok": True, "inserted": doc}