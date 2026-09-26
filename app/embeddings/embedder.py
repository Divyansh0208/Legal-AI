"""
Local, zero-cost embeddings via sentence-transformers. Model loads once and
is cached at module scope (loading it is the expensive part).
"""
from functools import lru_cache

from sentence_transformers import SentenceTransformer

from app.core.config import settings


@lru_cache
def get_embedder() -> SentenceTransformer:
    return SentenceTransformer(settings.EMBEDDING_MODEL)


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embedder()
    return model.encode(texts, show_progress_bar=False, convert_to_numpy=True).tolist()


def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]
