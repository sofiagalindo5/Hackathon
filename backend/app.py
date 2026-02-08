from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import db


from backend.routes.upload_routes import router as upload_router
from backend.routes.class_routes import router as class_router  # <-- adjust if file is class_rotes.py
from backend.routes.notes_routes import router as notes_router
from backend.routes.auth_routes import router as auth_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(class_router, prefix="/api", tags=["classes"])
app.include_router(notes_router, prefix="/api", tags=["notes"])
app.include_router(auth_router, prefix="/api", tags=["auth"])


@app.get("/")
def health():
    return {"status": "Backend running"}

@app.get("/db-test")
async def db_test():
    result = await db.test_collection.insert_one({"hello": "world"})
    doc = await db.test_collection.find_one({"_id": result.inserted_id})
    doc["_id"] = str(doc["_id"])
    return {"ok": True, "inserted": doc}
