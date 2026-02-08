import json
import os
from base64 import b64decode
from pathlib import Path

import requests

API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")
ENDPOINT = f"{API_BASE_URL}/api/upload-to-pdf-and-save"
CLASS_ID = os.getenv("CLASS_ID", "")
UPLOADED_BY = os.getenv("UPLOADED_BY", "user_1")

ROOT = Path(__file__).resolve().parent
TEST_IMAGES_DIR = ROOT / "test_images"
IMAGE_BASENAMES = ["IMG_2717", "IMG_2718", "IMG_2719", "IMG_2720"]

# 1x1 transparent PNG (fallback if no file exists)
PNG_BASE64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ"
    "AAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
)


def find_image_path(basename: str) -> Path | None:
    matches = list(TEST_IMAGES_DIR.glob(f"{basename}.*"))
    return matches[0] if matches else None


def upload_image(path: Path | None) -> None:
    if path and path.exists():
        image_bytes = path.read_bytes()
        filename = path.name
    else:
        image_bytes = b64decode(PNG_BASE64)
        filename = "test.png"

    if not CLASS_ID:
        raise RuntimeError("CLASS_ID is required to save uploads.")

    files = {"file": (filename, image_bytes, "image/png")}
    metadata = {
        "class_id": CLASS_ID,
        "uploaded_by": UPLOADED_BY,
        "summary": f"Test upload for {filename}",
    }

    resp = requests.post(
        ENDPOINT,
        files=files,
        data={"metadata": json.dumps(metadata)},
        timeout=30,
    )
    print("file:", filename)
    print("status:", resp.status_code)
    if not resp.ok:
        print("error:", resp.text)
        return

    try:
        data = resp.json()
        print("imageUrl:", data.get("imageUrl"))
        print("pdfUrl:", data.get("pdfUrl"))
    except Exception:
        print(resp.text)


def main() -> None:
    for basename in IMAGE_BASENAMES:
        upload_image(find_image_path(basename))


if __name__ == "__main__":
    main()
