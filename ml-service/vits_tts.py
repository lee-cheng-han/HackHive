"""
VITS TTS Service using Coqui TTS for proper model inference.
This replaces the minimal service with actual VITS model support.
"""
import os
import json
import logging
import numpy as np
import torch
from typing import Dict, Any, Optional
import io
import scipy.io.wavfile as wavfile
from pathlib import Path

from config import settings

logger = logging.getLogger(__name__)

class VitsTTSService:
    """TTS service using your trained VITS model with proper Coqui TTS integration."""
    
    def __init__(self):
        self.model = None
        self.config = None
        self.ap = None  # AudioProcessor
        self.tokenizer = None
        self.device = self._get_device()
        self._load_model()
    
    def _get_device(self) -> str:
        """Get the best available device."""
        if torch.cuda.is_available() and settings.DEVICE.lower() != "cpu":
            return "cuda"
        return "cpu"
    
    def _load_model(self):
        """Load the VITS model with proper configuration."""
        try:
            logger.info(f"Loading VITS model from {settings.MODEL_PATH}")
            logger.info(f"Using device: {self.device}")
            
            # Check if files exist
            model_path = Path(settings.MODEL_PATH)
            config_path = Path("./config.json")
            
            if not model_path.exists():
                logger.error(f"Model file not found: {model_path}")
                self.model = "mock"
                return
                
            if not config_path.exists():
                logger.error(f"Config file not found: {config_path}")
                self.model = "mock"
                return
            
            # Try to import TTS
            try:
                from TTS.tts.configs.vits_config import VitsConfig
                from TTS.tts.models.vits import Vits
                from TTS.tts.utils.text.tokenizer import TTSTokenizer
                from TTS.utils.audio import AudioProcessor
                logger.info("Successfully imported Coqui TTS")
            except ImportError as e:
                logger.error(f"Coqui TTS not available: {e}")
                logger.info("Falling back to mock mode")
                self.model = "mock"
                return
            
            # Load config
            with open(config_path, 'r') as f:
                config_dict = json.load(f)
            
            # Create VitsConfig from the loaded configuration
            self.config = VitsConfig()
            # Update config with loaded values
            for key, value in config_dict.items():
                if hasattr(self.config, key):
                    setattr(self.config, key, value)
            
            # Initialize audio processor
            self.ap = AudioProcessor.init_from_config(self.config)
            
            # Initialize tokenizer
            self.tokenizer, self.config = TTSTokenizer.init_from_config(self.config)
            
            # Create model
            self.model = Vits(self.config, self.ap, self.tokenizer, speaker_manager=None)
            
            # Load checkpoint
            checkpoint = torch.load(settings.MODEL_PATH, map_location=self.device)
            
            # Extract model state dict
            if 'model' in checkpoint:
                model_state = checkpoint['model']
            else:
                # If the checkpoint is the model state dict itself
                model_state = checkpoint
            
            # Load state dict
            self.model.load_state_dict(model_state)
            self.model.to(self.device)
            self.model.eval()
            
            logger.info("✅ VITS model loaded successfully!")
            logger.info(f"Model config: sample_rate={self.config.audio.sample_rate}, num_chars={self.config.model_args.num_chars}")
            
        except Exception as e:
            logger.error(f"Failed to load VITS model: {e}")
            logger.info("Falling back to mock mode")
            self.model = "mock"
    
    def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech using the VITS model.
        """
        if len(text) > settings.MAX_LENGTH:
            text = text[:settings.MAX_LENGTH]
            logger.warning(f"Text truncated to {settings.MAX_LENGTH} characters")
        
        try:
            if self.model == "mock":
                return self._generate_mock_audio(text)
            
            # Use the VITS model for actual inference
            logger.info(f"Generating speech for: '{text}'")
            
            # Preprocess text
            text_inputs = np.asarray(
                self.tokenizer.text_to_ids(text, language="en"), 
                dtype=np.int64
            )[None, :]
            
            # Convert to tensor
            text_inputs = torch.from_numpy(text_inputs).to(self.device)
            
            # Generate audio
            with torch.no_grad():
                outputs = self.model.inference(text_inputs)
            
            # Extract audio
            if isinstance(outputs, dict):
                audio = outputs["wav"]
            elif isinstance(outputs, (list, tuple)):
                audio = outputs[0]
            else:
                audio = outputs
            
            # Convert to numpy and ensure correct format
            if isinstance(audio, torch.Tensor):
                audio = audio.cpu().numpy()
            
            # Ensure audio is 1D
            if audio.ndim > 1:
                audio = audio.squeeze()
            
            # Normalize and convert to 16-bit PCM
            audio = np.clip(audio, -1.0, 1.0)
            audio_int16 = (audio * 32767).astype(np.int16)
            
            # Create WAV file in memory
            wav_buffer = io.BytesIO()
            sample_rate = int(self.config.audio.sample_rate)
            wavfile.write(wav_buffer, sample_rate, audio_int16)
            
            wav_bytes = wav_buffer.getvalue()
            logger.info(f"Generated {len(wav_bytes)} bytes of audio at {sample_rate}Hz")
            
            return wav_bytes
            
        except Exception as e:
            logger.error(f"VITS generation failed: {e}")
            # Fallback to mock audio
            return self._generate_mock_audio(text)
    
    def _generate_mock_audio(self, text: str) -> bytes:
        """Generate mock audio when model is not available."""
        duration = len(text.split()) * 0.5
        sample_rate = 22050
        samples = int(duration * sample_rate)
        
        # Simple sine wave
        t = np.linspace(0, duration, samples)
        audio = (0.1 * np.sin(2 * np.pi * 440 * t) * 32767).astype(np.int16)
        
        # Create WAV file in memory
        wav_buffer = io.BytesIO()
        wavfile.write(wav_buffer, sample_rate, audio)
        return wav_buffer.getvalue()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded VITS model."""
        if self.model is None:
            return {"status": "not_loaded", "error": "Model not available"}
        
        if self.model == "mock":
            return {
                "status": "mock_mode",
                "device": self.device,
                "model_path": settings.MODEL_PATH,
                "note": "VITS model not available, running in mock mode"
            }
        
        return {
            "status": "loaded",
            "device": self.device,
            "model_path": settings.MODEL_PATH,
            "model_type": "VITS",
            "sample_rate": self.config.audio.sample_rate if self.config else "unknown",
            "num_chars": self.config.model_args.num_chars if self.config else "unknown",
            "ready_for_inference": True,
            "note": "VITS model loaded and ready for Cree TTS generation!"
        }