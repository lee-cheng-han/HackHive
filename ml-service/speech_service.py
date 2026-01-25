"""
Speech recognition service using Whisper.
"""
import whisper
import torch
import numpy as np
import io
import soundfile as sf
import logging
from typing import Dict, Any, Optional

from config import settings

logger = logging.getLogger(__name__)


class SpeechRecognitionService:
    """Speech recognition service using Whisper."""
    
    def __init__(self):
        self.device = self._get_device()
        self.model = None
        self._load_whisper()
    
    def _get_device(self) -> str:
        """Get the appropriate device for inference."""
        if settings.DEVICE == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return settings.DEVICE
    
    def _load_whisper(self):
        """Load Whisper model."""
        try:
            logger.info(f"Loading Whisper model: {settings.WHISPER_MODEL}")
            self.model = whisper.load_model(settings.WHISPER_MODEL, device=self.device)
            logger.info("Whisper model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {e}")
            raise
    
    def transcribe_audio(self, audio_bytes: bytes, language: Optional[str] = None) -> Dict[str, Any]:
        """
        Transcribe audio to text.
        
        Args:
            audio_bytes: Audio data in bytes (WAV format)
            language: Language code (e.g., 'en', 'cr' for Cree)
            
        Returns:
            Dict with transcription results
        """
        if self.model is None:
            raise RuntimeError("Whisper model not loaded")
        
        try:
            # Convert bytes to audio array
            audio_array = self._bytes_to_audio(audio_bytes)
            
            # Transcribe with Whisper
            logger.info(f"Transcribing audio (language: {language})")
            
            # Prepare options
            options = {
                "language": language if language else None,
                "task": "transcribe"
            }
            
            result = self.model.transcribe(audio_array, **options)
            
            # Extract results
            transcription = result.get("text", "").strip()
            detected_language = result.get("language", "unknown")
            
            # Calculate confidence (Whisper doesn't provide direct confidence)
            # Use average log probability as proxy
            segments = result.get("segments", [])
            confidence = 0.0
            if segments:
                avg_logprob = np.mean([seg.get("avg_logprob", -1.0) for seg in segments])
                # Convert log prob to approximate confidence (0-1)
                confidence = max(0.0, min(1.0, np.exp(avg_logprob)))
            
            logger.info(f"Transcription: '{transcription}' (confidence: {confidence:.2f})")
            
            return {
                "transcription": transcription,
                "language_detected": detected_language,
                "confidence": confidence,
                "segments": segments
            }
            
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            raise
    
    def _bytes_to_audio(self, audio_bytes: bytes) -> np.ndarray:
        """Convert audio bytes to numpy array."""
        try:
            # Read audio from bytes
            buffer = io.BytesIO(audio_bytes)
            audio_data, sample_rate = sf.read(buffer)
            
            # Convert to float32 and ensure mono
            if audio_data.ndim > 1:
                audio_data = np.mean(audio_data, axis=1)
            
            audio_data = audio_data.astype(np.float32)
            
            # Resample if needed (Whisper expects 16kHz)
            if sample_rate != 16000:
                # Simple resampling (for better quality, use librosa.resample)
                import librosa
                audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=16000)
            
            return audio_data
            
        except Exception as e:
            logger.error(f"Audio processing failed: {e}")
            raise
    
    def get_supported_languages(self) -> list:
        """Get list of supported languages."""
        if self.model is None:
            return []
        
        return list(whisper.tokenizer.LANGUAGES.keys())
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the Whisper model."""
        if self.model is None:
            return {"status": "not_loaded", "error": "Model not available"}
        
        return {
            "status": "loaded",
            "model_name": settings.WHISPER_MODEL,
            "device": self.device,
            "supported_languages": self.get_supported_languages()
        }