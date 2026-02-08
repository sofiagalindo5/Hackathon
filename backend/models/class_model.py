from pydantic import BaseModel
from typing import List, Optional

# Pydantic Model of classes for FastAPI

class Note(BaseModel):
    imageUrl: str
    pdfUrl: str
    uploadedBy: str
    uploadedAt: Optional[str] = None
    summary: Optional[str] = None

# Defines what the client is allowed to send when creating a class.
class ClassCreate(BaseModel):
    name: str
    users: List[str] = []
    photos: List[Note] = []

# Defines what API sends back to the client. 
class ClassOut(BaseModel):
    id: str
    name: str
    users: List[str]
    photos: List[Note]

# This is what the data in the database can look like for a class.
# {
#   "_id": "classId123",
#   "name": "Biology 101",
#   "users": ["userId1", "userId2"],
#   "photos": [
#     {
#       "imageUrl": "https://cloudinary.com/.../image.jpg",
#       "pdfUrl": "https://cloudinary.com/.../image.pdf",
#       "uploadedBy": "userId1",
#       "uploadedAt": "2026-02-07T18:00:00Z",
#       "summary": "This chapter explains cell structure..."
#     }
#   ]
# }