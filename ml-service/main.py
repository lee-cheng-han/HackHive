"""
FastAPI application for TurtleTalk ML Service.
"""
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
from contextlib import asynccontextmanager

from config import settings
from tts_service import TTSService
from speech_service import SpeechRecognitionService

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Global service instances
tts_service: Optional[TTSService] = None
speech_service: Optional[SpeechRecognitionService] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for the FastAPI app."""
    global tts_service, speech_service
    
    # Startup
    logger.info("Starting TurtleTalk ML Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Device: {settings.DEVICE}")
    
    try:
        # Initialize TTS service
        logger.info("Loading TTS model...")
        tts_service = TTSService()
        logger.info("TTS service initialized")
        
        # Initialize Speech recognition service
        logger.info("Loading Whisper model...")
        speech_service = SpeechRecognitionService()
        logger.info("Speech service initialized")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        # Continue without the services for debugging
    
    yield
    
    # Shutdown
    logger.info("Shutting down ML Service...")


# Create FastAPI app
app = FastAPI(
    title="TurtleTalk ML Service",
    description="AI/ML service for Indigenous Language Learning Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class TTSRequest(BaseModel):
    """Request model for text-to-speech."""
    text: str
    language: Optional[str] = "en"
    voice_id: Optional[str] = "default"


class TTSResponse(BaseModel):
    """Response model for text-to-speech."""
    success: bool
    audio_length: Optional[float] = None
    error: Optional[str] = None


class TranscriptionResponse(BaseModel):
    """Response model for speech transcription."""
    transcription: str
    confidence: float
    language_detected: str
    success: bool
    error: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    services: Dict[str, Any]


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    tts_status = tts_service.get_model_info() if tts_service else {"status": "not_loaded"}
    speech_status = speech_service.get_model_info() if speech_service else {"status": "not_loaded"}
    
    return HealthResponse(
        status="healthy",
        services={
            "tts": tts_status,
            "speech_recognition": speech_status
        }
    )


# Text-to-speech endpoint
@app.post("/text-to-speech", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech.
    
    Args:
        request: TTS request with text and options
        
    Returns:
        Audio file bytes
    """
    if not tts_service:
        raise HTTPException(status_code=503, detail="TTS service not available")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Generate speech
        audio_bytes = tts_service.text_to_speech(request.text)
        
        # Return audio file
        return Response(
            content=audio_bytes,
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=speech.wav"}
        )
        
    except Exception as e:
        logger.error(f"TTS failed: {e}")
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@app.post("/text-to-speech-info", response_model=TTSResponse)
async def text_to_speech_info(request: TTSRequest):
    """
    Get information about TTS generation without returning audio.
    Useful for testing and getting audio length estimates.
    """
    if not tts_service:
        raise HTTPException(status_code=503, detail="TTS service not available")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Estimate audio length (approximate)
        word_count = len(request.text.split())
        estimated_duration = word_count * 0.6  # ~0.6 seconds per word
        
        return TTSResponse(
            success=True,
            audio_length=estimated_duration
        )
        
    except Exception as e:
        logger.error(f"TTS info failed: {e}")
        return TTSResponse(
            success=False,
            error=str(e)
        )


# Speech recognition endpoint
@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = None
):
    """
    Transcribe audio to text.
    
    Args:
        file: Audio file (WAV format preferred)
        language: Language hint (optional)
        
    Returns:
        Transcription results
    """
    if not speech_service:
        raise HTTPException(status_code=503, detail="Speech recognition service not available")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    try:
        # Read file content
        audio_bytes = await file.read()
        
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")
        
        # Transcribe
        result = speech_service.transcribe_audio(audio_bytes, language)
        
        return TranscriptionResponse(
            transcription=result["transcription"],
            confidence=result["confidence"],
            language_detected=result["language_detected"],
            success=True
        )
        
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        return TranscriptionResponse(
            transcription="",
            confidence=0.0,
            language_detected="unknown",
            success=False,
            error=str(e)
        )


# Model information endpoints
@app.get("/models/tts/info")
async def get_tts_info():
    """Get TTS model information."""
    if not tts_service:
        return {"status": "not_available"}
    return tts_service.get_model_info()


@app.get("/models/speech/info")
async def get_speech_info():
    """Get speech recognition model information."""
    if not speech_service:
        return {"status": "not_available"}
    return speech_service.get_model_info()


@app.get("/models/speech/languages")
async def get_supported_languages():
    """Get supported languages for speech recognition."""
    if not speech_service:
        return {"languages": []}
    return {"languages": speech_service.get_supported_languages()}


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "TurtleTalk ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/health",
            "/text-to-speech",
            "/transcribe",
            "/models/tts/info",
            "/models/speech/info"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )