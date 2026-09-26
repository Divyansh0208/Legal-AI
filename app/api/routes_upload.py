import asyncio
import os
import uuid

from fastapi import APIRouter, UploadFile, File, Depends, Request, HTTPException
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session

from app.api.schemas import UploadResponse
from app.core.config import settings
from app.core.rate_limit import limiter
from app.core.security import validate_upload
from app.db.database import get_db
from app.db.models import LegalDocument
from app.parsing.pdf_parser import extract_text_from_pdf
from app.rag.retriever import index_document
from app.rag.pipeline import summarize_document

router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
@limiter.limit(settings.RATE_LIMIT_UPLOAD)
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    contents = await validate_upload(file)

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF uploads are supported currently.")

    text, page_count, ocr_used = await run_in_threadpool(extract_text_from_pdf, contents)
    if not text.strip():
        raise HTTPException(status_code=422, detail="No extractable text found in document.")

    document_id = str(uuid.uuid4())
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    stored_path = os.path.join(settings.UPLOAD_DIR, f"{document_id}.pdf")
    with open(stored_path, "wb") as f:
        f.write(contents)

    chunks_indexed, summary = await asyncio.gather(
        run_in_threadpool(index_document, document_id, text, file.filename),
        run_in_threadpool(summarize_document, text),
    )

    record = LegalDocument(
        id=document_id,
        filename=file.filename,
        stored_path=stored_path,
        page_count=page_count,
        ocr_used=int(ocr_used),
        summary=summary,
    )
    db.add(record)
    db.commit()

    return UploadResponse(
        document_id=document_id,
        filename=file.filename,
        page_count=page_count,
        ocr_used=ocr_used,
        chunks_indexed=chunks_indexed,
        summary=summary,
    )
