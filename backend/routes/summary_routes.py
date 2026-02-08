from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from ..services.summarize_service import summarize_pdf_with_gemini_vision

router = APIRouter(prefix="/summaries", tags=["summaries"])

class SummaryResponse(BaseModel):
    summary: str

@router.post("", response_model=SummaryResponse)
async def generate_summary(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    summary_text = summarize_pdf_with_gemini_vision(file_bytes)
    return {"summary": summary_text}
