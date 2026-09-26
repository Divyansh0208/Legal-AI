"""
PDF text extraction. Falls back to OCR (app.parsing.ocr) per-page when a page
has little/no extractable text — i.e. it's a scanned image, not real text.
"""
import fitz  # PyMuPDF

from app.parsing.ocr import ocr_image_bytes

MIN_CHARS_BEFORE_OCR_FALLBACK = 20


def extract_text_from_pdf(pdf_bytes: bytes) -> tuple[str, int, bool]:
    """
    Returns (full_text, page_count, ocr_was_used).
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page_texts: list[str] = []
    ocr_used = False

    for page in doc:
        text = page.get_text().strip()
        if len(text) < MIN_CHARS_BEFORE_OCR_FALLBACK:
            pix = page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            text = ocr_image_bytes(img_bytes)
            ocr_used = True
        page_texts.append(text)

    page_count = doc.page_count
    doc.close()
    return "\n\n".join(page_texts), page_count, ocr_used
