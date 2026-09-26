from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.core.config import settings
from app.core.rate_limit import limiter
from app.core.security import SecurityHeadersMiddleware
from app.db.database import init_db
from app.api import routes_health, routes_query, routes_upload, routes_voice


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG, lifespan=lifespan)

# --- Rate limiting ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# --- Security headers ---
app.add_middleware(SecurityHeadersMiddleware)

# --- Routes ---
app.include_router(routes_health.router, prefix="/api")
app.include_router(routes_query.router, prefix="/api")
app.include_router(routes_upload.router, prefix="/api")
app.include_router(routes_voice.router, prefix="/api")
