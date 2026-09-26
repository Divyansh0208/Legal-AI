# Architecture

## Overview

```
User (voice/text/doc) 
      │
      ▼
React + Vite Frontend (JavaScript)
      │  (REST API calls)
      ▼
FastAPI Backend
      │
      ├─► Groq Whisper API      (speech-to-text)
      ├─► PyMuPDF + pytesseract (document parsing/OCR)
      ├─► sentence-transformers (embeddings)
      ├─► ChromaDB              (vector store / retrieval)
      ├─► LangChain             (RAG orchestration)
      ├─► Groq LLM API          (Llama3/Mixtral - answer generation)
      └─► PostgreSQL/SQLite     (user + case data)
```

## Flow

1. User submits query (text/voice) or uploads a legal document.
2. Voice → transcribed via Groq Whisper API.
3. Document → parsed via PyMuPDF; scanned pages OCR'd via pytesseract.
4. Text chunked and embedded (sentence-transformers) → stored in ChromaDB.
5. Query embedded → top-k relevant chunks retrieved from ChromaDB.
6. LangChain builds prompt with retrieved context → sent to Groq LLM.
7. Response returned to frontend, rendered to user.

## Module Structure

```
/app
  /api          - FastAPI routes
  /rag          - LangChain pipeline, retriever, prompt templates
  /parsing      - PDF/OCR handling
  /embeddings   - embedding generation
  /voice        - Whisper integration
  /db           - models, migrations
  /tests        - pytest suite
main.py
requirements.txt
.env.example

/frontend
  /src
    /components   - reusable UI (custom components added later)
    /pages        - route-level views
    /api          - fetch/axios calls to FastAPI backend
    /hooks        - custom React hooks
    App.jsx
    main.jsx
  vite.config.js
  package.json
```

## Security

- API keys via environment variables only
- Input validation on all endpoints (file type via python-magic, size limits)
- Rate limiting via slowapi on public endpoints
- Security headers middleware (CSP, X-Frame-Options, HSTS)
- Sanitized file storage (no arbitrary path execution)
- bandit SAST scan in CI

## Accessibility

- shadcn/ui (Radix-based) components — keyboard nav + ARIA by default
- eslint-plugin-jsx-a11y — catches missing alt-text/ARIA at lint time
- axe-core automated checks in CI

## Scalability Notes

- ChromaDB can be swapped for Qdrant Cloud if scale increases
- Groq API stateless calls — horizontally scalable backend
