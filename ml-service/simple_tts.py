"""
Simplified TTS service for testing without audio dependencies.
"""
import torch
import torch.nn as nn
import numpy as np
import io
import logging
from typing import Dict, Any, Optional
from pathlib import Path

from config import settings

logger = logging.getLogger(__name__)


class SimpleTTSService:
    """Simplified TTS service for testing."""
    
    def __init__(self):
        self.device = self._get_device()
        self.model = None
        self.sample_rate = settings.SAMPLE_RATE
        self._load_model()
        
    def _get_device(self) -> str:
        """Get the appropriate device for inference."""
        if settings.DEVICE == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return settings.DEVICE
    
    def _load_model(self):
        """Load the trained TTS model."""
        try:
            model_path = Path(settings.MODEL_PATH)
            if not model_path.exists():
                logger.warning(f"Model file not found: {model_path}. Using mock mode.")
                self.model = "mock"
                return
            
            logger.info(f"Loading TTS model from {model_path}")
            logger.info(f"Using device: {self.device}")
            
            # Load the model state dict
            checkpoint = torch.load(model_path, map_location=self.device)
            
            logger.info("Model loaded successfully (structure analysis)")
            
            # For now, just store the checkpoint
            self.model = checkpoint
            
        except Exception as e:
            logger.error(f"Failed to load TTS model: {e}")
            self.model = "mock"
    
    def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech audio (mock version).
        
        Args:
            text: Input text to synthesize
            
        Returns:
            Audio bytes in WAV format (mock)
        """
        if len(text) > settings.MAX_LENGTH:
            text = text[:settings.MAX_LENGTH]
            logger.warning(f"Text truncated to {settings.MAX_LENGTH} characters")
        
        try:
            # Generate mock audio (simple sine wave for testing)
            duration = len(text.split()) * 0.5  # 0.5 seconds per word
            audio = self._generate_mock_audio(duration)
            
            # Convert to bytes (mock WAV format)
            audio_bytes = self._audio_to_mock_bytes(audio, text)
            
            logger.info(f"Generated speech for text: '{text[:50]}...' ({len(audio_bytes)} bytes)")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            raise
    
    def _generate_mock_audio(self, duration: float) -> np.ndarray:
        """Generate mock audio for testing."""
        # Generate a simple tone
        audio_length = int(duration * self.sample_rate)
        t = np.linspace(0, duration, audio_length)
        
        # Simple melody for different frequencies
        freq = 440 + 100 * np.sin(t * 2)  # Varying frequency
        audio = 0.1 * np.sin(2 * np.pi * freq * t)  # Quiet volume
        
        return audio.astype(np.float32)
    
    def _audio_to_mock_bytes(self, audio: np.ndarray, text: str) -> bytes:
        """Convert audio array to mock WAV bytes."""
        # Simple mock WAV header + data
        header = b'RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x22\x56\x00\x00\x44\xAC\x00\x00\x02\x00\x10\x00data\x00\x08\x00\x00'
        
        # Convert audio to bytes (simplified)
        audio_data = (audio * 32767).astype(np.int16).tobytes()
        
        # Include text in a comment for debugging
        comment = f"TTS for: {text[:50]}...".encode('utf-8')
        
        return header + audio_data + comment
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        if self.model is None:
            return {"status": "not_loaded", "error": "Model not available"}
        
        if self.model == "mock":
            return {
                "status": "mock_mode",
                "device": self.device,
                "sample_rate": self.sample_rate,
                "max_length": settings.MAX_LENGTH,
                "model_path": settings.MODEL_PATH,
                "note": "Running in mock mode for testing"
            }
        
        return {
            "status": "loaded",
            "device": self.device,
            "sample_rate": self.sample_rate,
            "max_length": settings.MAX_LENGTH,
            "model_path": settings.MODEL_PATH,
            "model_type": type(self.model).__name__
        }