from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    session_id: str | None = None


class SourceRef(BaseModel):
    source: str
    distance: float


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceRef]
    disclaimer: str = "This is general legal information, not legal advice."


class UploadResponse(BaseModel):
    document_id: str
    filename: str
    page_count: int
    ocr_used: bool
    chunks_indexed: int
    summary: str


class VoiceResponse(BaseModel):
    transcript: str
