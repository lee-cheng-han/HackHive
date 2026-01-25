"""
Simple VITS TTS Service main application.
Uses the simplified VITS implementation that works with your checkpoint.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from typing import Optional

from config import settings
from simple_vits import SimpleVitsInference

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global TTS service instance
tts_service: Optional[SimpleVitsInference] = None

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "cree"
    voice_id: Optional[str] = "default"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global tts_service
    
    # Startup
    logger.info("🚀 Starting TurtleTalk Simple VITS ML Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Device: {settings.DEVICE}")
    logger.info("Loading your VITS model...")
    
    try:
        tts_service = SimpleVitsInference()
        logger.info("✅ Simple VITS TTS service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize TTS service: {e}")
        # Don't fail startup, just log the error
        tts_service = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down Simple VITS ML Service...")

# Create FastAPI app
app = FastAPI(
    title="TurtleTalk Simple VITS ML Service", 
    description="Simple VITS Text-to-Speech service for Cree language",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/health")
async def health_check():
    """Health check endpoint with model status."""
    global tts_service
    
    base_status = {
        "status": "healthy",
        "service": "simple-vits-tts",
        "environment": settings.ENVIRONMENT
    }
    
    if tts_service is None:
        base_status["tts_model"] = {"status": "not_loaded", "error": "Service not initialized"}
        return base_status
    
    model_info = tts_service.get_model_info()
    base_status["tts_model"] = model_info
    
    return base_status

@app.post("/text-to-speech")
async def generate_speech(request: TTSRequest):
    """
    Generate speech from text using the Simple VITS model.
    
    Args:
        request: TTSRequest with text and optional parameters
        
    Returns:
        WAV audio file
    """
    global tts_service
    
    if tts_service is None:
        raise HTTPException(status_code=503, detail="TTS service not available")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        logger.info(f"Generating speech for: '{request.text[:50]}...'")
        audio_bytes = tts_service.text_to_speech(request.text)
        
        return Response(
            content=audio_bytes,
            media_type="audio/wav",
            headers={
                "Content-Disposition": f"attachment; filename=speech.wav",
                "Content-Length": str(len(audio_bytes))
            }
        )
        
    except Exception as e:
        logger.error(f"TTS generation failed: {e}")
        raise HTTPException(status_code=500, detail="TTS generation failed")

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting Simple VITS TTS server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "simple_vits_main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )