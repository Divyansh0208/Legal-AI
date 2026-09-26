"""
ChromaDB-backed retriever. Chunks text (LangChain splitter), embeds locally
(sentence-transformers), stores/retrieves via a persistent Chroma collection.
"""
import chromadb
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.embeddings.embedder import embed_texts, embed_query

_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
_collection = _client.get_or_create_collection(name=settings.CHROMA_COLLECTION)

_splitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.CHUNK_SIZE,
    chunk_overlap=settings.CHUNK_OVERLAP,
)


def index_document(document_id: str, text: str, source_name: str) -> int:
    """Chunks + embeds + stores a document's text. Returns number of chunks stored."""
    chunks = _splitter.split_text(text)
    if not chunks:
        return 0

    embeddings = embed_texts(chunks)
    ids = [f"{document_id}:{i}" for i in range(len(chunks))]
    metadatas = [{"document_id": document_id, "source": source_name, "chunk": i} for i in range(len(chunks))]

    _collection.add(ids=ids, documents=chunks, embeddings=embeddings, metadatas=metadatas)
    return len(chunks)


def retrieve(query: str, top_k: int | None = None) -> list[dict]:
    """Returns top-k relevant chunks as [{"text", "source", "distance"}, ...]."""
    top_k = top_k or settings.RETRIEVAL_TOP_K
    query_embedding = embed_query(query)

    results = _collection.query(query_embeddings=[query_embedding], n_results=top_k)
    if not results["documents"] or not results["documents"][0]:
        return []

    hits = []
    for doc, meta, dist in zip(
        results["documents"][0], results["metadatas"][0], results["distances"][0]
    ):
        hits.append({"text": doc, "source": meta.get("source", "unknown"), "distance": dist})
    return hits
