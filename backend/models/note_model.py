from pydantic import BaseModel
from typing import Optional

class NoteBase(BaseModel):
    imageUrl: str
    pdfUrl: str
    uploadedBy: str
    summary: Optional[str] = None

class NoteCreate(BaseModel):
    imageUrl: str
    pdfUrl: str
    uploadedBy: str
    summary: Optional[str] = None

class Note(NoteBase):
    id: str
    uploadedAt: Optional[str] = None

# How notes is stored in the database. 
# {
#   "_id": "classId",
#   "photos": [
#     {
#       "_id": "noteId",
#       "imageUrl": "...",
#       "pdfUrl": "...",
#       "uploadedBy": "userId",
#       "uploadedAt": "...",
#       "summary": "..."
#     }
#   ]
# }

# What APIs should return for notes.
# {
#   "id": "noteId",
#   "imageUrl": "...",
#   "pdfUrl": "...",
#   "uploadedBy": "userId",
#   "uploadedAt": "...",
#   "summary": "..."
# }