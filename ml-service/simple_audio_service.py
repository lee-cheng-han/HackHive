"""
Simple audio service that uses browser speech synthesis instead of our model.
This avoids the complex VITS inference and just provides working audio.
"""
import logging
from typing import Dict, Any
import io
import numpy as np
import wave

logger = logging.getLogger(__name__)

class SimpleAudioService:
    """Simple service that generates placeholder audio."""
    
    def __init__(self):
        self.loaded = True
        logger.info("✅ Simple audio service initialized")
        
    def text_to_speech(self, text: str) -> bytes:
        """Generate simple beep audio as placeholder."""
        try:
            # Generate a simple beep pattern for the text
            duration = max(0.5, len(text) * 0.1)  # 100ms per character, min 0.5s
            sample_rate = 22050
            samples = int(duration * sample_rate)
            
            # Create a simple tone sequence
            t = np.linspace(0, duration, samples)
            
            # Different tones for different texts
            if 'tanisi' in text.lower() or 'tânisi' in text.lower():
                # Rising tone for greeting
                freq = 400 + 100 * np.sin(2 * np.pi * 2 * t)
            elif any(word in text.lower() for word in ['hello', 'hi']):
                # Simple tone for English
                freq = 300
            else:
                # Default tone
                freq = 350
            
            # Generate tone
            audio = 0.3 * np.sin(2 * np.pi * freq * t)
            
            # Apply envelope
            envelope = np.exp(-2 * t) * (1 - np.exp(-10 * t))
            audio *= envelope
            
            # Convert to 16-bit PCM
            audio_int16 = (audio * 32767).astype(np.int16)
            
            # Create WAV file
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wav_file:
                wav_file.setnchannels(1)  # Mono
                wav_file.setsampwidth(2)  # 2 bytes per sample
                wav_file.setframerate(sample_rate)
                wav_file.writeframes(audio_int16.tobytes())
            
            wav_buffer.seek(0)
            audio_bytes = wav_buffer.read()
            
            logger.info(f"Generated simple audio for '{text}': {len(audio_bytes)} bytes")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"Simple audio generation failed: {e}")
            # Return minimal WAV file
            return self._minimal_wav()
    
    def _minimal_wav(self) -> bytes:
        """Generate minimal valid WAV file."""
        sample_rate = 22050
        duration = 0.5
        samples = int(duration * sample_rate)
        
        # Simple sine wave
        t = np.linspace(0, duration, samples)
        audio = 0.2 * np.sin(2 * np.pi * 440 * t)  # 440Hz tone
        audio_int16 = (audio * 32767).astype(np.int16)
        
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_int16.tobytes())
        
        wav_buffer.seek(0)
        return wav_buffer.read()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get service info."""
        return {
            "status": "simple_audio",
            "type": "placeholder_tones",
            "note": "Using simple audio generation instead of complex VITS"
        }