"""
Voice input → text via Groq's hosted Whisper endpoint.
"""
import io

from groq import Groq

from app.core.config import settings

_client = Groq(api_key=settings.GROQ_API_KEY)


def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """Sends raw audio bytes to Groq Whisper, returns the transcript text."""
    transcription = _client.audio.transcriptions.create(
        file=(filename, io.BytesIO(audio_bytes)),
        model=settings.GROQ_WHISPER_MODEL,
        response_format="text",
    )
    # SDK returns either a str or an object with `.text` depending on response_format
    return transcription if isinstance(transcription, str) else transcription.text
