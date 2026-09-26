from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.schemas import QueryRequest, QueryResponse
from app.core.rate_limit import limiter
from app.core.config import settings
from app.db.database import get_db
from app.db.models import ChatSession, ChatMessage
from app.rag.pipeline import answer_question

router = APIRouter(tags=["query"])


@router.post("/query", response_model=QueryResponse)
@limiter.limit(settings.RATE_LIMIT_DEFAULT)
def query(request: Request, body: QueryRequest, db: Session = Depends(get_db)):
    result = answer_question(body.question)

    # Persist to chat history (create session if none given)
    session = None
    if body.session_id:
        session = db.get(ChatSession, body.session_id)
    if session is None:
        session = ChatSession()
        db.add(session)
        db.flush()

    db.add(ChatMessage(session_id=session.id, role="user", content=body.question))
    db.add(ChatMessage(session_id=session.id, role="assistant", content=result["answer"]))
    db.commit()

    return QueryResponse(answer=result["answer"], sources=result["sources"])
