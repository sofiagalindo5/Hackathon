import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary to use certain settings. 
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image_and_convert_to_pdf(file_bytes):
    # Upload the image.
    upload_result = cloudinary.uploader.upload(
        file_bytes,
        folder="notes-app"
    )

    # Extract the unique ID of the image. 
    public_id = upload_result["public_id"]

    # Generate PDF URL
    pdf_url = cloudinary.CloudinaryImage(public_id).build_url(format="pdf")

    return {
        "imageUrl": upload_result["secure_url"],
        "pdfUrl": pdf_url
    }
