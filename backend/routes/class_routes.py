from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from database import classes_collection
from models.class_model import ClassCreate, ClassOut

router = APIRouter(prefix="/classes", tags=["classes"])


# join a class 
@router.post("/{class_id}/join")
async def join_class(class_id: str, user_id: str):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    # Add user only if not already in the list
    result = await classes_collection.update_one(
        {"_id": class_obj_id},
        {"$addToSet": {"users": user_id}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")

    # If modified_count == 0, user was already a member (not an error)
    return {"message": "Joined class (or already a member)"} 

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

# GET all classes a user is signed up for. 
@router.get("", response_model=list[ClassOut])
async def get_user_classes(user_id: str):
    cursor = classes_collection.find({"users": user_id})
    classes = []

    async for doc in cursor:
        classes.append({
            "id": str(doc["_id"]),
            "name": doc["name"],
            "users": doc.get("users", []),
            "photos": doc.get("photos", [])
        })

    return classes

# GET class through search (name)
# /classes?name=Biology
@router.get("/search", response_model=list[ClassOut])
async def search_classes_by_name(name: str):
    cursor = classes_collection.find(
        {"name": {"$regex": name, "$options": "i"}}
    )

    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc["_id"]),
            "name": doc["name"],
            "users": doc.get("users", []),
            "photos": doc.get("photos", [])
        })

    return results

# GET class through (id)
# /classes/{class_id}
@router.get("/{class_id}", response_model=ClassOut)
async def get_class_by_id(class_id: str):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    doc = await classes_collection.find_one({"_id": class_obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Class not found")

    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "users": doc.get("users", []),
        "photos": doc.get("photos", [])
    }

# DELETE a class from the db
@router.delete("/{class_id}")
async def delete_class(class_id: str):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    result = await classes_collection.delete_one({"_id": class_obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")

    return {"message": "Class deleted successfully"}

# POST
# User drops a class.
@router.post("/{class_id}/drop")
async def drop_class(class_id: str, user_id: str):
    # Validate class_id
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    # Remove user from class
    result = await classes_collection.update_one(
        {"_id": class_obj_id},
        {"$pull": {"users": user_id}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="User not enrolled in this class")

    return {"message": "Successfully dropped the class"}