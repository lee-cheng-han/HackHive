"""
Configuration for TurtleTalk ML Service.
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """ML Service settings."""
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 3002
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Model Configuration
    MODEL_PATH: str = "./best_model.pth"
    DEVICE: str = "auto"  # auto, cpu, cuda
    MAX_LENGTH: int = 500  # Max text length for TTS
    
    # Audio Configuration
    SAMPLE_RATE: int = 22050
    AUDIO_FORMAT: str = "wav"  # wav, mp3
    
    # Whisper Configuration
    WHISPER_MODEL: str = "base"  # tiny, base, small, medium, large
    
    # API Configuration
    MAX_WORKERS: int = 1  # Number of concurrent model instances
    REQUEST_TIMEOUT: int = 30
    
    # Backend Integration
    BACKEND_URL: str = "http://localhost:3001"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()