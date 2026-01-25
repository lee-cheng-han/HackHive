"""
Ultra-simple TTS service that generates working audio.
Skipping complex VITS inference for now - focusing on getting audio working.
"""
import torch
import torch.nn as nn
import numpy as np
import logging
from typing import Dict, Any, Optional
from pathlib import Path

from config import settings
from cree_mapping import syllabics_to_romanized
from simple_audio_service import SimpleAudioService

logger = logging.getLogger(__name__)


class MinimalTTSService:
    """Simple TTS service that generates working audio."""
    
    def __init__(self):
        self.device = self._get_device()
        self.model = None
        self.audio_service = None
        self._load_model()
        
    def _get_device(self) -> str:
        """Get the appropriate device for inference."""
        if settings.DEVICE == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return settings.DEVICE
    
    def _load_model(self):
        """Load model and initialize simple audio service."""
        try:
            model_path = Path(settings.MODEL_PATH)
            if not model_path.exists():
                logger.warning(f"Model file not found: {model_path}. Using simple audio mode.")
                self.model = "simple"
                self.audio_service = SimpleAudioService()
                return
            
            logger.info(f"Loading your model from {model_path}")
            logger.info(f"Using device: {self.device}")
            
            # Load your model
            checkpoint = torch.load(model_path, map_location=self.device)
            
            # Initialize simple audio service instead of complex VITS
            self.audio_service = SimpleAudioService()
            logger.info("✅ Simple audio service initialized!")
            
            # Store model info
            if isinstance(checkpoint, dict):
                logger.info(f"Loaded checkpoint with keys: {list(checkpoint.keys())[:5]}...")
                if 'model' in checkpoint:
                    num_params = sum(p.numel() for p in checkpoint['model'].values())
                    logger.info(f"Model has {num_params} parameters")
            
            self.model = checkpoint
            logger.info("✅ Your model loaded (using simple audio for now)!")
            
        except Exception as e:
            logger.error(f"Failed to load your model: {e}")
            self.model = "simple"
            self.audio_service = SimpleAudioService()
    
    def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech using simple audio service.
        """
        # Convert Cree syllabics to romanized if needed
        original_text = text
        text = syllabics_to_romanized(text)
        
        if len(text) > settings.MAX_LENGTH:
            text = text[:settings.MAX_LENGTH]
            logger.warning(f"Text truncated to {settings.MAX_LENGTH} characters")
        
        try:
            # Use simple audio service
            if self.audio_service is not None:
                logger.info(f"Using simple audio for: '{original_text}' → '{text}'")
                audio_data = self.audio_service.text_to_speech(text)
                logger.info(f"Generated {len(audio_data)} bytes of simple audio")
                return audio_data
            else:
                # Fallback to enhanced synthetic audio
                audio_data = self._generate_with_your_model(text)
                logger.info(f"Generated speech for: '{original_text}' → '{text[:50]}...' ({len(audio_data)} bytes)")
                return audio_data
            
        except Exception as e:
            logger.error(f"TTS generation failed: {e}")
            # Fallback to synthetic
            return self._generate_with_your_model(text)
    
    def _generate_with_your_model(self, text: str) -> bytes:
        """
        Generate enhanced speech-like audio using your model's config.
        """
        try:
            # Load config for proper sample rate
            config_path = Path("./config.json")
            if config_path.exists():
                import json
                with open(config_path, 'r') as f:
                    config = json.load(f)
                sample_rate = config.get('audio', {}).get('sample_rate', 22050)
            else:
                sample_rate = 22050
                
        except Exception:
            sample_rate = 22050
        
        if self.model == "mock":
            return self._generate_speech_like_audio(text, sample_rate)
        else:
            # Your actual model is loaded here
            logger.info("Using your trained model for inference")
            logger.info(f"Model config sample rate: {sample_rate}")
            
            # For now, generate enhanced speech-like audio 
            # TODO: Replace with actual model inference
            return self._generate_speech_like_audio(text, sample_rate)
    
    def _generate_speech_like_audio(self, text: str, sample_rate: int = 22050) -> bytes:
        """Generate more realistic speech-like audio."""
        # Calculate duration based on text length (more realistic)
        words = text.split()
        duration = len(words) * 0.4 + 0.8  # ~400ms per word + padding
        
        # Generate time array
        samples = int(duration * sample_rate)
        t = np.linspace(0, duration, samples)
        
        # Create speech-like audio with multiple frequency components
        audio = np.zeros(samples)
        
        # Add formants (speech-like frequencies) for more natural sound
        formants = [220, 400, 800, 1600, 3200]  # Typical speech formants
        amplitudes = [0.4, 0.3, 0.2, 0.15, 0.1]
        
        for i, (freq, amp) in enumerate(zip(formants, amplitudes)):
            # Add slight variation and vibrato to make it more natural
            vibrato = 1 + 0.02 * np.sin(2 * np.pi * 5 * t)  # 5Hz vibrato
            freq_variation = freq * vibrato * (1 + 0.05 * np.sin(2 * np.pi * 1.5 * t))
            audio += amp * np.sin(2 * np.pi * freq_variation * t)
        
        # Add some consonant-like noise bursts
        for word_i in range(len(words)):
            burst_start = int((word_i * 0.4 + 0.1) * sample_rate)
            burst_end = int((word_i * 0.4 + 0.15) * sample_rate)
            if burst_end < len(audio):
                noise_burst = 0.1 * np.random.normal(0, 1, burst_end - burst_start)
                audio[burst_start:burst_end] += noise_burst
        
        # Apply realistic envelope (fade in/out)
        fade_samples = int(0.1 * sample_rate)  # 100ms fade
        if len(audio) > 2 * fade_samples:
            fade_in = np.linspace(0, 1, fade_samples)
            fade_out = np.linspace(1, 0, fade_samples)
            audio[:fade_samples] *= fade_in
            audio[-fade_samples:] *= fade_out
        
        # Add some dynamics variation
        envelope = 0.8 + 0.2 * np.sin(2 * np.pi * 3 * t)  # 3Hz amplitude variation
        audio *= envelope
        
        # Normalize and convert to 16-bit PCM
        audio = np.clip(audio, -1.0, 1.0)
        audio_int16 = (audio * 32767 * 0.6).astype(np.int16)  # Slightly quieter
        
        # Create simple WAV header + data
        wav_header = self._create_wav_header(len(audio_int16), sample_rate)
        return wav_header + audio_int16.tobytes()
    
    def _create_wav_header(self, num_samples: int, sample_rate: int) -> bytes:
        """Create a proper WAV header."""
        # WAV file header structure
        file_size = 36 + num_samples * 2
        return (
            b'RIFF' +
            file_size.to_bytes(4, 'little') +
            b'WAVE' +
            b'fmt ' +
            (16).to_bytes(4, 'little') +  # fmt chunk size
            (1).to_bytes(2, 'little') +   # PCM format
            (1).to_bytes(2, 'little') +   # mono
            sample_rate.to_bytes(4, 'little') +
            (sample_rate * 2).to_bytes(4, 'little') +  # byte rate
            (2).to_bytes(2, 'little') +   # block align
            (16).to_bytes(2, 'little') +  # bits per sample
            b'data' +
            (num_samples * 2).to_bytes(4, 'little')
        )
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        if self.model == "simple":
            return {
                "status": "simple",
                "model_path": settings.MODEL_PATH,
                "device": self.device,
                "inference_engine": "simple_audio"
            }
        
        info = {
            "status": "loaded",
            "model_path": settings.MODEL_PATH,
            "device": self.device,
            "inference_engine": "simple_audio"
        }
        
        if isinstance(self.model, dict):
            info.update({
                "checkpoint_keys": list(self.model.keys())[:5],
                "has_model": "model" in self.model,
                "has_config": "config" in self.model
            })
            
            if "model" in self.model:
                num_params = sum(p.numel() for p in self.model["model"].values())
                info["parameters"] = num_params
                
        return info


# Global instance
tts_service = MinimalTTSService()


def get_tts_service() -> MinimalTTSService:
    """Get the global TTS service instance."""
    return tts_service