# Development Workflow

## Branching
- `main` — stable, deployed branch (protected)
- `dev` — active development
- `feature/*` — individual features, merged into `dev` via PR

## Workflow Steps

1. Create feature branch from `dev`
2. Implement + write tests
3. Run local checks: `pytest`, `black .`, `flake8`
4. Push -> open PR into `dev`
5. GitHub Actions runs: tests, lint, security scan, accessibility check
6. Merge `dev` -> `main` when stable
7. Merge to `main` triggers auto-deploy to Render (via webhook in GitHub Actions)

## Commit Convention
```
feat: add RAG retriever for legal docs
fix: handle OCR failure on corrupt PDF
test: add pytest for /query endpoint
docs: update README setup steps
chore: update dependencies
```

## Pre-submission Checklist
- [ ] `.env` not committed, `.env.example` present
- [ ] All tests passing (`pytest`)
- [ ] README + ARCHITECTURE + PRD + TECHSTACK up to date
- [ ] Repo size < 10MB
- [ ] Repo is public
- [ ] Deployed link live and tested
- [ ] Changelog written for submission form

## GitHub Actions
| Workflow | Trigger | Action |
|---|---|---|
| `test.yml` | push/PR to `main`, `dev` | run pytest |
| `lint.yml` | push/PR to `main`, `dev` | flake8/black (backend) + eslint/jsx-a11y (frontend) |
| `security.yml` | push to `main`, `dev` | bandit (SAST) + pip-audit |
| `a11y.yml` | push/PR to `main`, `dev` | axe-core automated accessibility check against key routes |
| `deploy.yml` | push to `main` | trigger Render deploy hook (backend); Vercel auto-deploys separately via its own GitHub integration |