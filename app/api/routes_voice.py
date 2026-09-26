from fastapi import APIRouter, UploadFile, File, Request, HTTPException

from app.api.schemas import VoiceResponse
from app.core.config import settings
from app.core.rate_limit import limiter
from app.voice.transcribe import transcribe_audio

router = APIRouter(tags=["voice"])

_ALLOWED_AUDIO_EXTENSIONS = (".webm", ".wav", ".mp3", ".m4a", ".ogg")


@router.post("/voice", response_model=VoiceResponse)
@limiter.limit(settings.RATE_LIMIT_VOICE)
async def voice_to_text(request: Request, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(_ALLOWED_AUDIO_EXTENSIONS):
        raise HTTPException(status_code=415, detail="Unsupported audio format.")

    audio_bytes = await file.read()
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if len(audio_bytes) > max_bytes:
        raise HTTPException(status_code=413, detail=f"Audio exceeds {settings.MAX_UPLOAD_MB}MB limit.")

    transcript = transcribe_audio(audio_bytes, filename=file.filename)
    return VoiceResponse(transcript=transcript)
