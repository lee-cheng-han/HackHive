"""
AI Tutor routes (Google Gemini integration).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.config import settings

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message schema."""
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response schema."""
    response: str
    conversation_id: str
    translation: Optional[str] = None


@router.post("/ai-tutor/chat", response_model=ChatResponse)
async def chat_with_tutor(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Chat with AI tutor (Google Gemini).
    """
    # TODO: Implement Gemini API integration
    # For now, return mock response
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI tutor service not configured"
        )
    
    return {
        "response": "Mock AI tutor response",
        "conversation_id": chat_message.conversation_id or "default",
        "translation": "Mock translation"
    }

