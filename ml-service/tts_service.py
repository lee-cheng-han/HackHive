"""
Text-to-Speech service using the trained PyTorch model.
"""
import torch
import torch.nn as nn
import numpy as np
import soundfile as sf
import io
import logging
from typing import Dict, Any, Optional
from pathlib import Path

from config import settings

logger = logging.getLogger(__name__)


class TTSModel(nn.Module):
    """
    Base TTS model class. This should match the architecture of best_model.pth.
    Since we don't know the exact architecture, we'll create a flexible loader.
    """
    def __init__(self):
        super().__init__()
        # This will be populated when loading the state dict
        
    def forward(self, text_features):
        # This will be defined based on the loaded model structure
        pass


class TTSService:
    """Text-to-Speech service using the trained model."""
    
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
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            logger.info(f"Loading TTS model from {model_path}")
            logger.info(f"Using device: {self.device}")
            
            # Load the model state dict
            checkpoint = torch.load(model_path, map_location=self.device)
            
            # Try to determine model structure from checkpoint
            if isinstance(checkpoint, dict):
                if 'model_state_dict' in checkpoint:
                    state_dict = checkpoint['model_state_dict']
                    logger.info("Found model_state_dict in checkpoint")
                elif 'state_dict' in checkpoint:
                    state_dict = checkpoint['state_dict']
                    logger.info("Found state_dict in checkpoint")
                else:
                    # Assume the entire dict is the state dict
                    state_dict = checkpoint
                    logger.info("Using entire checkpoint as state_dict")
            else:
                # If it's just a model object
                self.model = checkpoint
                self.model.eval()
                self.model.to(self.device)
                logger.info("Loaded complete model object")
                return
            
            # Create a flexible model that can adapt to the state dict
            self.model = self._create_model_from_state_dict(state_dict)
            self.model.load_state_dict(state_dict, strict=False)
            self.model.eval()
            self.model.to(self.device)
            
            logger.info("TTS model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load TTS model: {e}")
            self.model = None
            raise
    
    def _create_model_from_state_dict(self, state_dict: Dict[str, torch.Tensor]) -> nn.Module:
        """
        Create a model architecture based on the state dict keys.
        This is a generic approach since we don't know the exact architecture.
        """
        logger.info("Analyzing model architecture from state dict...")
        
        # Log the structure to understand the model
        for key in list(state_dict.keys())[:10]:  # Log first 10 keys
            logger.info(f"State dict key: {key}, shape: {state_dict[key].shape}")
        
        # Create a simple wrapper that can hold any state dict
        class FlexibleTTSModel(nn.Module):
            def __init__(self, state_dict_keys):
                super().__init__()
                # Create parameters based on state dict
                for key, tensor in state_dict.items():
                    # Convert key to valid parameter name
                    param_name = key.replace('.', '_').replace('-', '_')
                    self.register_parameter(param_name, nn.Parameter(tensor))
            
            def forward(self, x):
                # This will need to be implemented based on the actual model
                # For now, return a dummy output
                batch_size = x.size(0) if hasattr(x, 'size') else 1
                # Return dummy audio (silence)
                return torch.zeros(batch_size, 22050, device=x.device if hasattr(x, 'device') else 'cpu')
        
        return FlexibleTTSModel(state_dict)
    
    def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech audio.
        
        Args:
            text: Input text to synthesize
            
        Returns:
            Audio bytes in WAV format
        """
        if self.model is None:
            raise RuntimeError("TTS model not loaded")
        
        if len(text) > settings.MAX_LENGTH:
            text = text[:settings.MAX_LENGTH]
            logger.warning(f"Text truncated to {settings.MAX_LENGTH} characters")
        
        try:
            # Preprocess text (this would need to match your model's preprocessing)
            processed_text = self._preprocess_text(text)
            
            # Generate audio
            with torch.no_grad():
                # This is a placeholder - you'll need to adapt this to your model's interface
                audio = self._generate_audio(processed_text)
            
            # Convert to bytes
            audio_bytes = self._audio_to_bytes(audio)
            
            logger.info(f"Generated speech for text: '{text[:50]}...'")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            raise
    
    def _preprocess_text(self, text: str) -> torch.Tensor:
        """
        Preprocess text for the model.
        This is a placeholder - adapt to your model's requirements.
        """
        # Convert text to token IDs or whatever your model expects
        # For now, create dummy input
        text_len = len(text.split())
        return torch.randint(0, 1000, (1, text_len), device=self.device)
    
    def _generate_audio(self, processed_text: torch.Tensor) -> np.ndarray:
        """
        Generate audio from processed text.
        This needs to be adapted to your model's forward pass.
        """
        # This is a placeholder implementation
        # You'll need to adapt this to your model's actual interface
        
        # For now, generate silence as a placeholder
        duration = len(processed_text[0]) * 0.5  # 0.5 seconds per token
        audio_length = int(duration * self.sample_rate)
        
        # Generate some basic tone as placeholder (replace with actual model output)
        audio = np.sin(2 * np.pi * 440 * np.linspace(0, duration, audio_length))
        audio = audio * 0.1  # Make it quiet
        
        return audio.astype(np.float32)
    
    def _audio_to_bytes(self, audio: np.ndarray) -> bytes:
        """Convert audio array to bytes."""
        # Create in-memory buffer
        buffer = io.BytesIO()
        
        # Write audio to buffer
        sf.write(buffer, audio, self.sample_rate, format='WAV')
        
        # Get bytes
        buffer.seek(0)
        return buffer.read()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        if self.model is None:
            return {"status": "not_loaded", "error": "Model not available"}
        
        return {
            "status": "loaded",
            "device": self.device,
            "sample_rate": self.sample_rate,
            "max_length": settings.MAX_LENGTH,
            "model_path": settings.MODEL_PATH
        }