# AI for Legal Assistance & Access

AI-powered legal assistant — RAG-based Q&A, document analysis, and voice support for legal access, built for [Challenge Name] hackathon.

## Problem Statement

Legal assistance is often inaccessible due to cost, complexity, and language barriers. This platform provides AI-driven legal guidance, document understanding, and multilingual support to bridge that gap.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI |
| LLM | Groq API (Llama3-70B / Mixtral) |
| RAG Framework | LangChain |
| Vector DB | ChromaDB |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| Document Parsing | PyMuPDF, pytesseract (OCR) |
| Speech-to-Text | Groq Whisper API |
| Frontend | React + Vite (JavaScript) |
| Security | slowapi, python-magic, security headers, bandit |
| Accessibility | shadcn/ui, eslint-plugin-jsx-a11y, axe-core |
| Database | PostgreSQL / SQLite |
| Deployment | Render (backend), Vercel (frontend) |
| CI/CD | GitHub Actions |

## Features

- Legal document Q&A via RAG
- OCR support for scanned legal documents
- Voice input for queries
- Multilingual support (English + regional languages)
- Secure, validated file uploads

## Setup

```bash
git clone <repo-url>
cd <repo-name>
pip install -r requirements.txt
cp .env.example .env   # add GROQ_API_KEY, DB_URL etc.
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

```
GROQ_API_KEY=
DATABASE_URL=
CHROMA_DB_PATH=
```

## Testing

```bash
pytest tests/
```

## Deployment

- Backend: Render (auto-deploy via GitHub Actions on push to `main`)
- Frontend: Vercel

## Security Notes

- No API keys committed; `.env` used and gitignored
- File upload type (python-magic) and size validation
- Rate limiting via slowapi on public endpoints
- Security headers middleware (CSP, X-Frame-Options, HSTS)
- bandit static security scan + dependency vulnerability scanning via GitHub Actions

## License

MIT
