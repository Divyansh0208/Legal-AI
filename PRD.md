# Product Requirements Document (PRD)

## Project Name
AI for Legal Assistance & Access

## Problem Statement
Access to legal help is limited by cost, complexity of legal language, and language barriers. Most people can't afford lawyers for basic guidance or don't understand legal documents they receive.

## Goal
Build an AI assistant that helps users understand legal documents and get answers to legal questions in plain language — free and fast.

## Target Users
- Individuals needing basic legal guidance (tenancy, consumer rights, contracts)
- People unable to afford lawyers
- Anyone who receives a legal document they don't understand

## Core Features (MVP)

| Feature | Priority | Status |
|---|---|---|
| Upload legal doc (PDF/scanned) -> get summary | High | Built |
| Ask legal question -> RAG-based answer | High | Built |
| Voice input for queries | Medium | Built |
| Chat session (in-memory, resets on page reload) | Low | Built |
| Multi-language support | Medium | Deferred -- not implemented in this submission |

## Out of Scope (for hackathon MVP)
- Real lawyer connection/marketplace
- Case filing / court integration
- Payment processing
- Multi-language support (deferred to a future iteration)
- Persistent chat history across sessions/devices

## Success Metrics (aligned to eval parameters)
- **Code Quality**: modular, typed, documented
- **Security**: no leaked keys, validated uploads, hardened system prompt against injection and misuse
- **Efficiency**: fast inference (Groq), low latency responses
- **Testing**: pytest coverage on core API endpoints (health, query, upload)
- **Accessibility**: ARIA/semantic UI, keyboard nav, automated axe-core checks in CI
- **Problem Statement Alignment**: directly solves legal access gap

## Constraints
- Must be public GitHub repo, <10MB
- Must have live deployed link
- Max 3 submission attempts
- Submission window: 13/09/2026 - 26/09/2026

## Risks
- Free-tier API rate limits under judge testing load
- OCR accuracy on poor-quality scanned docs
- Legal accuracy/liability -- mitigated with a mandatory "not legal advice" disclaimer on every substantive answer