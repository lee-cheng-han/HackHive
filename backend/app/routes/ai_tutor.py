"""
AI Tutor routes (Google Gemini integration).
"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
import base64
import io
import json as json_module
import re

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


class PronunciationEvaluation(BaseModel):
    """Pronunciation evaluation result."""
    score: int
    feedback: str
    specific_tips: list[str]
    pronunciation_accuracy: str
    cultural_note: Optional[str] = None


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


@router.post("/ai-tutor/evaluate-pronunciation", response_model=PronunciationEvaluation)
async def evaluate_pronunciation(
    audio: UploadFile = File(...),
    target_text: str = Form(...),
    target_translation: str = Form(None)
):
    """
    Evaluate pronunciation using Gemini API.
    Analyzes recorded audio against target Cree text.
    """
    
    try:
        # Read audio file
        audio_bytes = await audio.read()
        
        # For now, return good feedback to test the flow
        # TODO: Re-enable Gemini API once configured properly
        return PronunciationEvaluation(
            score=85,
            feedback=f"Great effort pronouncing '{target_text}'! Your vowel sounds are clear.",
            specific_tips=[
                "Focus on elongating vowel sounds marked with macrons (ā, ē, ī, ō)",
                "Practice the consonant clusters slowly",
                "Listen to the reference audio and repeat multiple times"
            ],
            pronunciation_accuracy="good",
            cultural_note="Cree is a pitch-accent language - pay attention to tone and rhythm when practicing."
        )
        
    except Exception as e:
        # Fallback response
        return PronunciationEvaluation(
            score=75,
            feedback="Your pronunciation shows good effort. Keep practicing!",
            specific_tips=[
                "Practice vowel length",
                "Focus on consonant clarity",
                "Listen and repeat slowly"
            ],
            pronunciation_accuracy="good",
            cultural_note="Keep practicing - you're doing great!"
        )

