"""
SQLAlchemy engine + session factory. Works with SQLite (default, file-based)
or PostgreSQL (set DATABASE_URL to a postgres:// DSN) with no code changes.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session, closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create tables if they don't exist. Call once on startup."""
    from app.db import models  # noqa: F401  (ensures models are registered)
    Base.metadata.create_all(bind=engine)
