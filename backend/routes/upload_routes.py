import json

from fastapi import APIRouter, UploadFile, File, HTTPException, Form

from backend.services.upload_service import (
    upload_image_and_convert_to_pdf,
    upload_image_and_save_note,
)

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


@router.post("/upload-to-pdf-and-save")
async def upload_to_pdf_and_save(
    file: UploadFile = File(...),
    metadata: str = Form(...),
):
    try:
        try:
            data = json.loads(metadata)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid metadata JSON") from e

        class_id = data.get("class_id")
        uploaded_by = data.get("uploaded_by")
        summary = data.get("summary")

        if not class_id or not uploaded_by:
            raise HTTPException(
                status_code=400,
                detail="Missing class_id or uploaded_by in metadata",
            )

        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file upload.")

        return await upload_image_and_save_note(
            file_bytes=file_bytes,
            class_id=class_id,
            uploaded_by=uploaded_by,
            summary=summary,
        )

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except Exception as e:
        # Return readable backend error to frontend
        raise HTTPException(status_code=400, detail=str(e))