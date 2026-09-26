"""
OCR fallback for scanned pages/images. Requires the `tesseract-ocr` system
package to be installed (apt-get install tesseract-ocr), not just the pip
wrapper.
"""
import io

import pytesseract
from PIL import Image


def ocr_image_bytes(image_bytes: bytes, lang: str = "eng") -> str:
    """OCR a single image (PNG/JPEG bytes) and return extracted text."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        return pytesseract.image_to_string(image, lang=lang).strip()
    except Exception as exc:  # corrupt image, missing tesseract binary, etc.
        raise RuntimeError(f"OCR failed: {exc}") from exc
