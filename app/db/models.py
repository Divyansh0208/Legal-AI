import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=_uuid)
    created_at = Column(DateTime, default=_now)
    language = Column(String, default="en")

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=_uuid)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" | "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=_now)

    session = relationship("ChatSession", back_populates="messages")


class LegalDocument(Base):
    __tablename__ = "legal_documents"

    id = Column(String, primary_key=True, default=_uuid)
    filename = Column(String, nullable=False)
    stored_path = Column(String, nullable=False)
    page_count = Column(Integer, default=0)
    ocr_used = Column(Integer, default=0)  # 0/1 boolean (SQLite-friendly)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_now)
