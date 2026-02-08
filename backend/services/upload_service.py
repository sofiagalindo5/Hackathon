import os
from datetime import datetime

from bson import ObjectId
from dotenv import load_dotenv

import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError

from backend.database import classes_collection

load_dotenv()

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if not CLOUD_NAME or not API_KEY or not API_SECRET:
    raise RuntimeError(
        "Cloudinary config missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env"
    )

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
    secure=True,
)

def upload_image_and_convert_to_pdf(file_bytes: bytes):
    try:
        upload_result = cloudinary.uploader.upload(
            file_bytes,
            folder="notes-app",
            resource_type="image",
            type="upload",
            access_mode="public",
        )

        public_id = upload_result.get("public_id")
        secure_url = upload_result.get("secure_url")

        if not public_id or not secure_url:
            raise RuntimeError(f"Cloudinary upload missing fields: {upload_result}")

        pdf_url = cloudinary.CloudinaryImage(public_id).build_url(format="pdf")

        return {"imageUrl": secure_url, "pdfUrl": pdf_url}

    except CloudinaryError as e:
        # Cloudinary-specific error (bad credentials, etc.)
        raise RuntimeError(f"Cloudinary error: {str(e)}") from e
    except Exception as e:
        # Anything else
        raise RuntimeError(f"Upload/convert failed: {str(e)}") from e


async def upload_image_and_save_note(
    file_bytes: bytes,
    class_id: str,
    uploaded_by: str,
    summary: str | None = None,
):
    try:
        class_obj_id = ObjectId(class_id)
    except Exception as e:
        raise ValueError("Invalid class_id") from e

    upload_result = upload_image_and_convert_to_pdf(file_bytes)

    note_id = ObjectId()
    note_doc = {
        "_id": note_id,
        "imageUrl": upload_result["imageUrl"],
        "pdfUrl": upload_result["pdfUrl"],
        "uploadedBy": uploaded_by,
        "uploadedAt": datetime.utcnow().isoformat(),
        "summary": summary,
    }

    result = await classes_collection.update_one(
        {"_id": class_obj_id},
        {"$push": {"photos": note_doc}},
    )

    if result.matched_count == 0:
        raise LookupError("Class not found")

    return {
        "id": str(note_id),
        **note_doc,
        "_id": None,
    }

