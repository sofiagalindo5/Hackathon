from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime
from backend.database import classes_collection
from backend.models.note_model import Note, NoteCreate

router = APIRouter(prefix="/notes", tags=["notes"])

# GET all notes from a class
@router.get("", response_model=list[Note])
async def get_notes(class_id: str = Query(...)):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    doc = await classes_collection.find_one(
        {"_id": class_obj_id},
        {"photos": 1}
    )

    if not doc:
        raise HTTPException(status_code=404, detail="Class not found")

    notes = []
    for note in doc.get("photos", []):
        notes.append({
            "id": str(note["_id"]),
            "imageUrl": note["imageUrl"],
            "pdfUrl": note["pdfUrl"],
            "uploadedBy": note["uploadedBy"],
            "uploadedAt": note.get("uploadedAt"),
            "summary": note.get("summary")
        })

    return notes

# POST a note to a class
@router.post("", response_model=Note)
async def create_note(
    class_id: str = Query(...),
    note: NoteCreate = ...
):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    note_id = ObjectId()
    note_doc = {
        "_id": note_id,
        "imageUrl": note.imageUrl,
        "pdfUrl": note.pdfUrl,
        "uploadedBy": note.uploadedBy,
        "uploadedAt": datetime.utcnow().isoformat(),
        "summary": note.summary
    }

    result = await classes_collection.update_one(
        {"_id": class_obj_id},
        {"$push": {"photos": note_doc}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")

    return {
        "id": str(note_id),
        **note_doc,
        "_id": None
    }

# GET a single note
@router.get("/{note_id}", response_model=Note)
async def get_note(
    note_id: str,
    class_id: str = Query(...)
):
    try:
        class_obj_id = ObjectId(class_id)
        note_obj_id = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    doc = await classes_collection.find_one(
        {"_id": class_obj_id, "photos._id": note_obj_id},
        {"photos.$": 1}
    )

    if not doc or "photos" not in doc:
        raise HTTPException(status_code=404, detail="Note not found")

    note = doc["photos"][0]

    return {
        "id": str(note["_id"]),
        "imageUrl": note["imageUrl"],
        "pdfUrl": note["pdfUrl"],
        "uploadedBy": note["uploadedBy"],
        "uploadedAt": note.get("uploadedAt"),
        "summary": note.get("summary")
    }

# DELETE a note from a class
@router.delete("/{note_id}")
async def delete_note(
    note_id: str,
    class_id: str = Query(...)
):
    try:
        class_obj_id = ObjectId(class_id)
        note_obj_id = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = await classes_collection.update_one(
        {"_id": class_obj_id},
        {"$pull": {"photos": {"_id": note_obj_id}}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")

    return {"message": "Note deleted successfully"}