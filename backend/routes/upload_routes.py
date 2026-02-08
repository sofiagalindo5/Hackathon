from fastapi import APIRouter, UploadFile, File, HTTPException
from services.upload_service import upload_image_and_convert_to_pdf

router = APIRouter()

@router.post("/upload-to-pdf")
async def upload_to_pdf(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file upload.")

        result = upload_image_and_convert_to_pdf(file_bytes)
        return result

    except HTTPException:
        raise
    except Exception as e:
        # Return readable backend error to frontend
        raise HTTPException(status_code=400, detail=str(e))