"""
AI service integrations (Gemini, ElevenLabs, Presage).
"""
import logging
from typing import Optional, Dict, Any
import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Google Gemini API service for conversational AI."""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-1.5-flash"
    
    async def chat(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        language: str = "cr"
    ) -> str:
        """
        Send a message to Gemini AI tutor.
        
        Args:
            message: User's message
            context: Additional context (user level, previous messages, etc.)
            language: Target Indigenous language code
        
        Returns:
            AI response string
        """
        if not self.api_key:
            logger.warning("Gemini API key not configured")
            return "AI tutor is not available. Please configure GEMINI_API_KEY."
        
        # Build prompt for Indigenous language tutor
        system_prompt = f"""You are a helpful and encouraging Indigenous language tutor for Plains Cree (Nēhiyawēwin).
Your role is to:
- Help learners practice the language
- Provide translations and explanations
- Correct pronunciation gently
- Share cultural context when appropriate
- Keep responses concise and encouraging

User level: {context.get('level', 'beginner') if context else 'beginner'}
Language: Plains Cree (cr)

Respond in a friendly, supportive tone. If the user asks in English, respond with the Cree phrase first, then explain in English."""
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/{self.model}:generateContent?key={self.api_key}",
                    json={
                        "contents": [{
                            "parts": [
                                {"text": f"{system_prompt}\n\nUser: {message}\n\nAssistant:"}
                            ]
                        }]
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                else:
                    logger.error(f"Gemini API error: {response.status_code} - {response.text}")
                    return "Sorry, I'm having trouble right now. Please try again."
        
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return "Sorry, I encountered an error. Please try again."


class ElevenLabsService:
    """ElevenLabs TTS service for pronunciation audio."""
    
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1"
    
    async def text_to_speech(
        self,
        text: str,
        voice_id: str = "21m00Tcm4TlvDq8ikWAM"  # Default voice
    ) -> bytes:
        """
        Convert text to speech.
        
        Args:
            text: Text to convert
            voice_id: ElevenLabs voice ID
        
        Returns:
            Audio bytes (MP3)
        """
        if not self.api_key:
            logger.warning("ElevenLabs API key not configured")
            raise ValueError("TTS service not configured")
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/text-to-speech/{voice_id}",
                    headers={"xi-api-key": self.api_key},
                    json={
                        "text": text,
                        "model_id": "eleven_monolingual_v1",
                        "voice_settings": {
                            "stability": 0.5,
                            "similarity_boost": 0.75
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.content
                else:
                    logger.error(f"ElevenLabs API error: {response.status_code}")
                    raise ValueError("TTS generation failed")
        
        except Exception as e:
            logger.error(f"Error calling ElevenLabs API: {e}")
            raise


class PresageService:
    """Presage AI service for engagement detection."""
    
    def __init__(self):
        self.api_key = settings.PRESAGE_API_KEY
        self.enabled = settings.PRESAGE_ENABLED
    
    async def analyze_engagement(
        self,
        video_frame: bytes,
        user_id: str
    ) -> Dict[str, Any]:
        """
        Analyze user engagement from video frame.
        
        Args:
            video_frame: Video frame bytes
            user_id: User ID for tracking
        
        Returns:
            Engagement metrics (focus, emotion, heart_rate, etc.)
        """
        if not self.enabled or not self.api_key:
            return {
                "enabled": False,
                "message": "Presage not configured"
            }
        
        # TODO: Implement Presage SDK integration
        # For now, return mock data
        return {
            "enabled": True,
            "focus_level": 75,  # 0-100
            "emotion": "neutral",  # neutral, happy, confused, frustrated
            "heart_rate": 72,  # BPM
            "engagement_score": 80,  # 0-100
            "recommendation": "User is engaged and focused"
        }


# Service instances
gemini_service = GeminiService()
elevenlabs_service = ElevenLabsService()
presage_service = PresageService()

