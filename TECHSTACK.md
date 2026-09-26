# Tech Stack

## Language
Python (base)

## Backend
- **FastAPI** — async REST API framework

## LLM / AI
- **Groq API** — LLM inference (currently openai/gpt-oss-120b) — free, fast, cloud-ready
- **Groq Whisper API** — speech-to-text (voice input)

## RAG Pipeline
- **LangChain** — orchestration (retriever, prompt chains)
- **ChromaDB** — vector store (embeddable, free, deployable on Render)
- **sentence-transformers** (`all-MiniLM-L6-v2`) — local embeddings, no API cost

## Document Processing
- **PyMuPDF** — PDF text extraction
- **pytesseract** — OCR for scanned documents

## Frontend
- **React + Vite** (JavaScript, no TypeScript)
- **Tailwind CSS** — styling, custom design tokens (no component library)
- Deploy: **Vercel**

## Security
- **slowapi** — rate limiting on FastAPI endpoints
- **python-magic** — real file-type validation on uploads (not just extension check)
- **Starlette security headers middleware** — CSP, X-Frame-Options, HSTS
- **bandit** — static security analysis (SAST), run via GitHub Actions
- System prompt hardened against prompt injection (uploaded documents and retrieved context treated as untrusted data)

## Accessibility
- **eslint-plugin-jsx-a11y** — lint for missing alt-text/ARIA issues
- **axe-core** — automated accessibility testing in CI
- Manual a11y patterns in the frontend: `aria-live`, `sr-only` labels, `focus-visible` rings, `aria-pressed`/`aria-expanded`, reduced-motion support

## Database
- **SQLite** (local file, via SQLAlchemy) — swappable for Postgres by changing `DATABASE_URL` and adding a driver, not currently required

## Deployment
- **Render** — backend + vector DB
- **Vercel** — frontend (React + Vite)

## CI/CD
- **GitHub Actions**
  - pytest on push/PR (`main`, `dev`)
  - lint (flake8/black, eslint + jsx-a11y) on push/PR
  - bandit + pip-audit (SAST + dependency check) on push
  - axe-core (accessibility check) on push/PR
  - auto-deploy to Render on merge to `main`

## Testing
- **pytest** — API endpoint tests (health, query, upload), mocked LLM calls

## Why this stack
- 100% free-tier deployable, no local-only dependency
- Full Python — consistent with base language decision
- Groq gives fast inference — scores well on Efficiency
- ChromaDB + sentence-transformers = zero-cost RAG core