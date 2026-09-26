"""
Centralized settings. Loaded once, imported everywhere via `settings`.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Core ---
    APP_NAME: str = "AI Legal Assistant"
    ENV: str = "development"  # development | production
    DEBUG: bool = True

    # --- LLM (Groq) ---
    GROQ_API_KEY: str = ""
    GROQ_LLM_MODEL: str = "llama3-70b-8192"
    GROQ_WHISPER_MODEL: str = "whisper-large-v3"

    # --- RAG ---
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    CHROMA_DB_PATH: str = "./data/chroma"
    CHROMA_COLLECTION: str = "legal_docs"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    RETRIEVAL_TOP_K: int = 4

    # --- Database ---
    DATABASE_URL: str = "sqlite:///./data/app.db"

    # --- Uploads ---
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_MB: int = 15
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "image/png",
        "image/jpeg",
    ]

    # --- Security / CORS ---
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173"]
    RATE_LIMIT_DEFAULT: str = "30/minute"
    RATE_LIMIT_UPLOAD: str = "10/minute"
    RATE_LIMIT_VOICE: str = "10/minute"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
