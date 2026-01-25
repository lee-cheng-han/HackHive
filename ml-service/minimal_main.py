"""
Minimal FastAPI app for your TTS model - no external audio dependencies.
"""
import logging
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from config import settings
from minimal_tts import MinimalTTSService

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Global service instance
tts_service: Optional[MinimalTTSService] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for the FastAPI app."""
    global tts_service
    
    # Startup
    logger.info("🚀 Starting TurtleTalk ML Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Device: {settings.DEVICE}")
    
    try:
        # Initialize TTS service
        logger.info("Loading your TTS model...")
        tts_service = MinimalTTSService()
        logger.info("✅ TTS service initialized")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize TTS service: {e}")
        # Continue without the service for debugging
    
    yield
    
    # Shutdown
    logger.info("Shutting down ML Service...")


# Create FastAPI app
app = FastAPI(
    title="TurtleTalk ML Service",
    description="Your Custom TTS Model Service",
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


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    tts_model: Dict[str, Any]


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    tts_status = tts_service.get_model_info() if tts_service else {"status": "not_loaded"}
    
    return HealthResponse(
        status="healthy",
        tts_model=tts_status
    )


# Text-to-speech endpoint
@app.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using your trained model.
    """
    if not tts_service:
        raise HTTPException(status_code=503, detail="TTS service not available")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Generate speech using your model
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


# Model information endpoint
@app.get("/model/info")
async def get_model_info():
    """Get information about your TTS model."""
    if not tts_service:
        return {"status": "not_available"}
    return tts_service.get_model_info()


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "TurtleTalk ML Service",
        "version": "1.0.0",
        "status": "running",
        "model": "Your Custom TTS Model",
        "endpoints": [
            "/health",
            "/text-to-speech", 
            "/model/info"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "minimal_main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )