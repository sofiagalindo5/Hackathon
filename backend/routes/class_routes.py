from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from ..database import classes_collection
from ..models.class_model import Note, ClassCreate, ClassOut

router = APIRouter(prefix="/classes", tags=["classes"])

# POST a class
@router.post("", response_model=ClassOut)
async def create_class(class_data: ClassCreate):
    new_class = {
        "name": class_data.name,
        "users": class_data.users,
        "photos": class_data.photos,
        "createdAt": datetime.utcnow().isoformat()
    }

    result = await classes_collection.insert_one(new_class)

    return {
        "id": str(result.inserted_id),
        **class_data.dict()
    }

# GET all notes from a class
@router.get("/{class_id}/notes", response_model=list[Note])
async def get_class_notes(class_id: str):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    doc = await classes_collection.find_one({"_id": class_obj_id}, {"photos": 1})
    if not doc:
        raise HTTPException(status_code=404, detail="Class not found")

    return doc.get("photos", [])