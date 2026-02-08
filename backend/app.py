from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import db 


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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