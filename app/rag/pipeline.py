"""
Orchestrates retrieval + generation. Uses Groq's OpenAI-compatible chat
completions endpoint directly (thin wrapper — no LangChain LLM class needed
for this single call, keeping the hot path simple and easy to test).
"""
from groq import Groq

from app.core.config import settings
from app.rag.prompts import SYSTEM_PROMPT, RAG_ANSWER_TEMPLATE, SUMMARY_TEMPLATE
from app.rag.retriever import retrieve

_client = Groq(api_key=settings.GROQ_API_KEY)


def answer_question(question: str) -> dict:
    """Retrieves context, asks the LLM, returns answer + sources used."""
    hits = retrieve(question)
    context = "\n\n---\n\n".join(h["text"] for h in hits) if hits else ""

    completion = _client.chat.completions.create(
        model=settings.GROQ_LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": RAG_ANSWER_TEMPLATE.format(context=context, question=question)},
        ],
        temperature=0.2,
        max_tokens=800,
    )

    return {
        "answer": completion.choices[0].message.content,
        "sources": [{"source": h["source"], "distance": h["distance"]} for h in hits],
    }


def summarize_document(document_text: str) -> str:
    """One-shot plain-language summary of an uploaded document (no retrieval needed)."""
    truncated = document_text[:12000]  # keep prompt within a safe token budget
    completion = _client.chat.completions.create(
        model=settings.GROQ_LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": SUMMARY_TEMPLATE.format(document_text=truncated)},
        ],
        temperature=0.2,
        max_tokens=600,
    )
    return completion.choices[0].message.content
