from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import db 

from auth_api import router as auth_router
from user_routes import router as user_router
from users_repo import ensure_user_indexes



app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await ensure_user_indexes()



@app.get("/")
def health():
    return {"status": "Backend running"}


@app.get("/db-test")
async def db_test():
    #inserts small doc and then reads it back
    result = await db.test_collection.insert_one({"hello": "world"})
    doc = await db.test_collection.find_one({"_id": result.inserted_id})
    
    doc["_id"] = str(doc["_id"])
    return {"ok": True, "inserted": doc}

print("ROUTES:", [r.path for r in app.router.routes])
