import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_pdf_with_gemini_vision(file_bytes: bytes):
    """
    Sends the PDF bytes directly to Gemini Vision.
    Gemini will read the images inside the PDF and summarize them.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")  # Vision-capable model

    prompt = """
    You are an AI assistant that summarizes handwritten or photographed notes.
    Extract the text from the PDF pages and produce a clean, structured summary.
    Use bullet points and highlight key ideas.
    """

    response = model.generate_content(
        [
            prompt,
            {"mime_type": "application/pdf", "data": file_bytes}
        ]
    )

    return response.text
