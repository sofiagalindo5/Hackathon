import os
from dotenv import load_dotenv

import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError

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

