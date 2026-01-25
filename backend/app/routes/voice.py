"""
Voice/audio processing routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
import httpx
import logging
from typing import Optional

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/voice-to-text")
async def transcribe_audio(
    file: UploadFile = File(...),
    language_code: str = Form("cr"),
    db: Session = Depends(get_db)
):
    """
    Transcribe audio to text using ML service.
    """
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400, 
                detail="File must be an audio file"
            )
        
        # Read file content
        audio_bytes = await file.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")
        
        # Call ML service
        async with httpx.AsyncClient(timeout=settings.ML_SERVICE_TIMEOUT) as client:
            files = {"file": (file.filename, audio_bytes, file.content_type)}
            params = {"language": language_code}
            
            response = await client.post(
                f"{settings.ML_SERVICE_URL}/transcribe",
                files=files,
                params=params
            )
            
            if response.status_code != 200:
                logger.error(f"ML service error: {response.status_code}")
                # Fallback to mock response
                return {
                    "transcription": "Mock transcription (ML service unavailable)",
                    "confidence": 0.85,
                    "language_detected": language_code
                }
            
            result = response.json()
            return {
                "transcription": result.get("transcription", ""),
                "confidence": result.get("confidence", 0.0),
                "language_detected": result.get("language_detected", language_code)
            }
            
    except httpx.RequestError as e:
        logger.error(f"ML service connection error: {e}")
        # Fallback to mock response
        return {
            "transcription": "Mock transcription (ML service unavailable)",
            "confidence": 0.85,
            "language_detected": language_code
        }
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed")


@router.post("/pronunciation/evaluate")
async def evaluate_pronunciation(
    file: UploadFile = File(...),
    target_text: str = Form(...),
    language_code: str = Form("cr"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluate pronunciation and provide feedback.
    """
    # TODO: Implement pronunciation evaluation via ML service
    # For now, return mock response
    return {
        "score": 75,
        "accuracy": 0.75,
        "feedback": "Good try! Keep practicing.",
        "issues": []
    }


@router.post("/text-to-speech")
async def generate_speech(
    text: str = Form(...),
    language: str = Form("en"),
    db: Session = Depends(get_db)
):
    """
    Generate speech from text using ML service.
    """
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Call ML service
        async with httpx.AsyncClient(timeout=settings.ML_SERVICE_TIMEOUT) as client:
            response = await client.post(
                f"{settings.ML_SERVICE_URL}/text-to-speech",
                json={
                    "text": text,
                    "language": language
                }
            )
            
            if response.status_code != 200:
                logger.error(f"ML service TTS error: {response.status_code}")
                raise HTTPException(
                    status_code=503, 
                    detail="TTS service unavailable"
                )
            
            # Return the audio file
            return Response(
                content=response.content,
                media_type="audio/wav",
                headers={"Content-Disposition": "attachment; filename=speech.wav"}
            )
            
    except httpx.RequestError as e:
        logger.error(f"ML service connection error: {e}")
        raise HTTPException(
            status_code=503, 
            detail="TTS service unavailable"
        )
    except Exception as e:
        logger.error(f"TTS generation error: {e}")
        raise HTTPException(status_code=500, detail="TTS generation failed")

