import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./data/test.db")
os.environ.setdefault("CHROMA_DB_PATH", "./data/test_chroma")

import pytest
from fastapi.testclient import TestClient

from main import app
from app.db.database import init_db


@pytest.fixture(scope="session", autouse=True)
def _setup_test_db():
    init_db()
    yield


@pytest.fixture
def client():
    return TestClient(app)
