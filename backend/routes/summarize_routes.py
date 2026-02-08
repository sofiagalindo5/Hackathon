from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.summarize_service import summarize_pdf_with_gemini_vision

router = APIRouter()

@router.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    file_bytes = await file.read()

    summary = summarize_pdf_with_gemini_vision(file_bytes)

    return {"summary": summary}
