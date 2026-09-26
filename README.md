# AI for Legal Assistance & Access

AI-powered legal assistant — RAG-based Q&A, document analysis, and voice support for legal access, built for [Challenge Name] hackathon.

## Problem Statement

Legal assistance is often inaccessible due to cost, complexity, and language barriers. This platform provides AI-driven legal guidance and document understanding in plain, jargon-free language.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI |
| LLM | Groq API (openai/gpt-oss-120b) |
| RAG Framework | LangChain |
| Vector DB | ChromaDB |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Document Parsing | PyMuPDF, pytesseract (OCR) |
| Speech-to-Text | Groq Whisper API |
| Frontend | React + Vite (JavaScript), Tailwind CSS |
| Security | slowapi, python-magic, security headers, bandit |
| Accessibility | eslint-plugin-jsx-a11y, axe-core (CI) |
| Database | SQLite |
| Deployment | Render (backend), Vercel (frontend) |
| CI/CD | GitHub Actions (lint, test, security, a11y, deploy) |

## Features

- Legal document Q&A via RAG, grounded in uploaded documents
- OCR support for scanned legal documents
- Voice input for queries (Groq Whisper)
- Plain-language answers with mandatory legal disclaimers
- Prompt-injection resistant: uploaded documents and retrieved context are treated as data, never instructions
- Secure, validated file uploads (real MIME sniffing, not just file extension)

## Setup

```bash
git clone <repo-url>
cd <repo-name>
pip install -r requirements.txt
cp .env.example .env   # add GROQ_API_KEY
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

GROQ_API_KEY=

GROQ_LLM_MODEL=openai/gpt-oss-120b

GROQ_WHISPER_MODEL=whisper-large-v3

DATABASE_URL=sqlite:///./data/app.db

CHROMA_DB_PATH=./data/chroma


## Testing

```bash
pytest
```

## Deployment

- Backend: Render (deploy hook wired into GitHub Actions on push to `main`)
- Frontend: Vercel (auto-deploy via Vercel's GitHub integration)

## Security Notes

- No API keys committed; `.env` used and gitignored
- File upload type verified via python-magic content sniffing, not client-supplied extension
- File size limits enforced on both document and audio uploads
- Rate limiting via slowapi on query, upload, and voice endpoints
- Security headers middleware (CSP, X-Frame-Options, HSTS in production)
- System prompt explicitly treats retrieved context and uploaded documents as untrusted data, and refuses harassment, forged-document, and law-evasion requests regardless of framing
- bandit static security scan + dependency checks via GitHub Actions

## License

MIT
