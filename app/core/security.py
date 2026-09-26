"""
Security helpers: response headers middleware + upload validation.
Real MIME sniffing via python-magic (never trust client-supplied extension).
"""
import magic
from fastapi import UploadFile, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds baseline security headers to every response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; frame-ancestors 'none'; object-src 'none'"
        )
        if settings.ENV == "production":
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains; preload"
            )
        return response


async def validate_upload(file: UploadFile) -> bytes:
    """
    Reads the upload, checks real size + sniffed MIME type.
    Raises HTTPException on any violation. Returns raw bytes for the caller.
    """
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.MAX_UPLOAD_MB}MB limit.",
        )

    detected_type = magic.from_buffer(contents, mime=True)
    if detected_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type detected: {detected_type}",
        )

    await file.seek(0)
    return contents
