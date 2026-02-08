from fastapi import APIRouter, UploadFile, File
from backend.services.upload_service import upload_image_and_convert_to_pdf

router = APIRouter()

# POST http://localhost:8000/api/upload-to-pdf
@router.post("/upload-to-pdf")
async def upload_to_pdf(file: UploadFile = File(...)):
    file_bytes = await file.read()
    result = upload_image_and_convert_to_pdf(file_bytes)
    return result

# What you're supposed to get
# {
#   "imageUrl": "https://res.cloudinary.com/.../image.jpg",
#   "pdfUrl": "https://res.cloudinary.com/.../image.pdf"
# }
