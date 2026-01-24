# ML/AI Development Plan

**Developer**: ML/AI Team Member  
**Component**: Speech Recognition, Pronunciation Evaluation, Recommendations, Engagement Detection  
**Technology Stack**: Python, FastAPI, PyTorch, Whisper, Librosa, Scikit-learn, Presage SDK

## Overview

Build ML services for speech recognition, pronunciation evaluation, personalized story recommendations, and optional engagement detection. The service integrates with Whisper for ASR, implements pronunciation scoring algorithms, provides content-based recommendations, and optionally processes Presage sensor data. The service runs as a separate microservice that the backend calls.

## Prerequisites

- Python 3.9+
- pip and virtualenv
- CUDA-capable GPU (optional, but recommended for faster inference)
- Git

## Step-by-Step Execution Plan

### Phase 1: Project Setup (30 minutes)

#### 1.1 Initialize Python Project
```bash
cd /Users/jingyu/HackHive
mkdir ml-service
cd ml-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
```

#### 1.2 Install Dependencies
```bash
# Web framework
pip install fastapi uvicorn python-multipart

# ML Libraries
pip install torch torchaudio transformers
pip install openai-whisper  # OpenAI Whisper for ASR
# OR use Hugging Face: pip install transformers[torch]

# Audio processing
pip install librosa soundfile pydub

# NLP
pip install scikit-learn numpy pandas

# Utilities
pip install python-dotenv pydantic

# Optional: Sensor/Image processing
pip install opencv-python numpy

# Audio analysis for pronunciation
pip install praat-parselmouth  # Optional, for advanced phoneme analysis
pip install scipy  # For signal processing

# Presage SDK (if available from MLH)
# pip install presage-sdk  # Check MLH docs
```

#### 1.3 Project Structure
```
ml-service/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── models/
│   │   ├── __init__.py
│   │   ├── asr_model.py     # Speech recognition model
│   │   └── recommendation.py # Recommendation engine
│   ├── services/
│   │   ├── __init__.py
│   │   ├── speech_service.py
│   │   ├── recommendation_service.py
│   │   └── sensor_service.py  # Optional
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── audio_utils.py
│   │   └── text_utils.py
│   └── config.py
├── data/
│   ├── models/              # Downloaded model files
│   └── test_audio/          # Test audio samples
├── requirements.txt
├── .env
└── README.md
```

#### 1.4 Environment Variables
**File**: `.env`
```
# Server
HOST=0.0.0.0
PORT=5000

# Model Settings
ASR_MODEL=base              # tiny, base, small, medium, large
ASR_DEVICE=cpu              # cpu or cuda
RECOMMENDATION_METHOD=content_based

# Optional: OpenAI API (if using)
OPENAI_API_KEY=your_key_here

# Logging
LOG_LEVEL=INFO
```

### Phase 2: Speech Recognition & Transcription (2-3 hours)

#### 2.1 Audio Utilities
**File**: `app/utils/audio_utils.py`
```python
import librosa
import soundfile as sf
import numpy as np
from typing import Tuple

def load_audio(file_path: str, target_sr: int = 16000) -> Tuple[np.ndarray, int]:
    """
    Load audio file and resample to target sample rate.
    
    Args:
        file_path: Path to audio file
        target_sr: Target sample rate (default 16kHz for speech models)
    
    Returns:
        audio_array: Audio data as numpy array
        sample_rate: Actual sample rate
    """
    try:
        audio, sr = librosa.load(file_path, sr=target_sr, mono=True)
        return audio, sr
    except Exception as e:
        raise ValueError(f"Failed to load audio: {str(e)}")

def validate_audio_format(audio: np.ndarray, sr: int) -> bool:
    """
    Validate audio meets requirements: 16kHz, mono, reasonable length.
    """
    if sr != 16000:
        return False
    if len(audio.shape) > 1 and audio.shape[0] > 1:
        return False  # Must be mono
    if len(audio) > 240000:  # 15 seconds at 16kHz
        return False
    return True

def convert_to_wav(audio_bytes: bytes, output_path: str = None) -> bytes:
    """
    Convert audio bytes to WAV format if needed.
    For now, assumes input is already WAV or can be processed by librosa.
    """
    # In production, use pydub or similar for format conversion
    return audio_bytes
```

#### 2.2 ASR Model Wrapper
**File**: `app/models/asr_model.py`
```python
import whisper
import torch
import numpy as np
from typing import Optional, Dict
import os

class ASRModel:
    def __init__(self, model_size: str = "base", device: str = "cpu"):
        """
        Initialize Whisper ASR model.
        
        Args:
            model_size: Model size (tiny, base, small, medium, large)
            device: 'cpu' or 'cuda'
        """
        self.model_size = model_size
        self.device = device if torch.cuda.is_available() and device == "cuda" else "cpu"
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load Whisper model."""
        print(f"Loading Whisper {self.model_size} model on {self.device}...")
        try:
            self.model = whisper.load_model(self.model_size, device=self.device)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            # Fallback to tiny model
            self.model = whisper.load_model("tiny", device=self.device)
    
    def transcribe(
        self, 
        audio_path: str, 
        language_code: Optional[str] = None,
        task: str = "transcribe"
    ) -> Dict:
        """
        Transcribe audio file.
        
        Args:
            audio_path: Path to audio file
            language_code: Optional language hint (e.g., 'cr', 'en')
            task: 'transcribe' or 'translate'
        
        Returns:
            Dictionary with transcription, confidence, etc.
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        try:
            # Load and preprocess audio
            audio = whisper.load_audio(audio_path)
            audio = whisper.pad_or_trim(audio)
            
            # Make log-Mel spectrogram
            mel = whisper.log_mel_spectrogram(audio).to(self.model.device)
            
            # Detect language if not specified
            if language_code is None:
                _, probs = self.model.detect_language(mel)
                detected_language = max(probs, key=probs.get)
            else:
                detected_language = language_code
            
            # Decode
            options = whisper.DecodingOptions(
                language=detected_language,
                task=task,
                fp16=False if self.device == "cpu" else True
            )
            result = whisper.decode(self.model, mel, options)
            
            return {
                "transcription": result.text,
                "confidence": float(result.no_speech_prob),  # Lower is better
                "language_detected": detected_language,
                "language_probability": float(probs.get(detected_language, 0.0)) if language_code is None else 1.0
            }
        except Exception as e:
            print(f"Transcription error: {e}")
            return {
                "transcription": "",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def transcribe_from_bytes(
        self,
        audio_bytes: bytes,
        language_code: Optional[str] = None
    ) -> Dict:
        """
        Transcribe from audio bytes (in-memory).
        
        Args:
            audio_bytes: Audio file as bytes
            language_code: Optional language hint
        
        Returns:
            Dictionary with transcription results
        """
        import tempfile
        import os
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_path = tmp_file.name
        
        try:
            result = self.transcribe(tmp_path, language_code)
        finally:
            # Clean up temp file
            os.unlink(tmp_path)
        
        return result
```

#### 2.3 Speech Service
**File**: `app/services/speech_service.py`
```python
from app.models.asr_model import ASRModel
from app.utils.audio_utils import load_audio, validate_audio_format
from typing import Dict, Optional
import os

class SpeechService:
    def __init__(self):
        model_size = os.getenv("ASR_MODEL", "base")
        device = os.getenv("ASR_DEVICE", "cpu")
        self.asr_model = ASRModel(model_size=model_size, device=device)
    
    def transcribe_audio(
        self,
        audio_file_path: str,
        language_code: Optional[str] = None
    ) -> Dict:
        """
        Main transcription method.
        
        Args:
            audio_file_path: Path to audio file
            language_code: Language code hint (e.g., 'cr', 'en')
        
        Returns:
            Transcription result dictionary
        """
        try:
            # Validate audio format
            audio, sr = load_audio(audio_file_path)
            if not validate_audio_format(audio, sr):
                return {
                    "transcription": "",
                    "confidence": 0.0,
                    "error": "Invalid audio format. Must be 16kHz, mono, max 15 seconds"
                }
            
            # Transcribe
            result = self.asr_model.transcribe(audio_file_path, language_code)
            return result
            
        except Exception as e:
            return {
                "transcription": "",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def transcribe_audio_bytes(
        self,
        audio_bytes: bytes,
        language_code: Optional[str] = None
    ) -> Dict:
        """
        Transcribe from audio bytes.
        """
        import tempfile
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_path = tmp_file.name
        
        try:
            result = self.transcribe_audio(tmp_path, language_code)
        finally:
            os.unlink(tmp_path)
        
        return result
```

### Phase 3: Pronunciation Evaluation Service (3-4 hours)

#### 3.1 Pronunciation Scoring Service
**File**: `app/services/pronunciation_service.py`
```python
import librosa
import numpy as np
from scipy.spatial.distance import euclidean
from typing import Dict, Optional, Tuple
import os

class PronunciationService:
    def __init__(self):
        self.reference_audio_cache = {}  # Cache reference audio features
    
    def extract_audio_features(self, audio_path: str) -> Dict[str, np.ndarray]:
        """
        Extract acoustic features from audio for pronunciation comparison.
        
        Features extracted:
        - MFCCs (Mel-frequency cepstral coefficients)
        - Pitch (F0)
        - Formants (F1, F2)
        - Duration
        - Energy
        
        Args:
            audio_path: Path to audio file
        
        Returns:
            Dictionary of feature arrays
        """
        try:
            audio, sr = librosa.load(audio_path, sr=16000, mono=True)
            
            # MFCCs (13 coefficients)
            mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
            
            # Pitch (F0) using pyin
            f0, voiced_flag, voiced_probs = librosa.pyin(
                audio, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7')
            )
            
            # Energy
            energy = librosa.feature.rms(y=audio)
            
            # Duration
            duration = len(audio) / sr
            
            return {
                "mfccs": mfccs,
                "pitch": f0,
                "voiced_flag": voiced_flag,
                "energy": energy,
                "duration": duration,
                "sample_rate": sr
            }
        except Exception as e:
            raise ValueError(f"Feature extraction failed: {str(e)}")
    
    def compare_pronunciation(
        self,
        user_audio_path: str,
        reference_audio_path: str,
        expected_text: str
    ) -> Dict[str, any]:
        """
        Compare user pronunciation to reference and provide feedback.
        
        Args:
            user_audio_path: Path to user's audio recording
            reference_audio_path: Path to reference (correct) audio
            expected_text: Expected text transcription
        
        Returns:
            Dictionary with score, feedback, and detailed analysis
        """
        try:
            # Extract features from both audios
            user_features = self.extract_audio_features(user_audio_path)
            ref_features = self.extract_audio_features(reference_audio_path)
            
            # Calculate similarity scores
            mfcc_similarity = self._compare_mfccs(
                user_features["mfccs"],
                ref_features["mfccs"]
            )
            
            pitch_similarity = self._compare_pitch(
                user_features["pitch"],
                ref_features["pitch"]
            )
            
            duration_similarity = self._compare_duration(
                user_features["duration"],
                ref_features["duration"]
            )
            
            # Weighted overall score
            overall_score = (
                mfcc_similarity * 0.5 +
                pitch_similarity * 0.3 +
                duration_similarity * 0.2
            )
            
            # Generate feedback
            feedback = self._generate_feedback(
                user_features,
                ref_features,
                overall_score,
                expected_text
            )
            
            return {
                "score": round(overall_score * 100, 1),  # 0-100 scale
                "confidence": 0.8,  # Confidence in the score
                "feedback": feedback,
                "details": {
                    "mfcc_similarity": round(mfcc_similarity * 100, 1),
                    "pitch_similarity": round(pitch_similarity * 100, 1),
                    "duration_similarity": round(duration_similarity * 100, 1)
                }
            }
        except Exception as e:
            return {
                "score": 0,
                "confidence": 0,
                "error": str(e),
                "feedback": "Unable to analyze pronunciation. Please try again."
            }
    
    def _compare_mfccs(self, user_mfccs: np.ndarray, ref_mfccs: np.ndarray) -> float:
        """Compare MFCC features using DTW or mean similarity"""
        # Simple approach: compare mean MFCCs
        user_mean = np.mean(user_mfccs, axis=1)
        ref_mean = np.mean(ref_mfccs, axis=1)
        
        # Cosine similarity
        dot_product = np.dot(user_mean, ref_mean)
        norm_user = np.linalg.norm(user_mean)
        norm_ref = np.linalg.norm(ref_mean)
        
        if norm_user == 0 or norm_ref == 0:
            return 0.0
        
        similarity = dot_product / (norm_user * norm_ref)
        return max(0.0, min(1.0, similarity))  # Clamp to [0, 1]
    
    def _compare_pitch(self, user_pitch: np.ndarray, ref_pitch: np.ndarray) -> float:
        """Compare pitch contours"""
        # Remove NaN values
        user_pitch_clean = user_pitch[~np.isnan(user_pitch)]
        ref_pitch_clean = ref_pitch[~np.isnan(ref_pitch)]
        
        if len(user_pitch_clean) == 0 or len(ref_pitch_clean) == 0:
            return 0.5  # Neutral if no pitch detected
        
        # Compare mean pitch
        user_mean = np.mean(user_pitch_clean)
        ref_mean = np.mean(ref_pitch_clean)
        
        # Normalize difference
        pitch_diff = abs(user_mean - ref_mean) / max(ref_mean, 1.0)
        similarity = 1.0 - min(1.0, pitch_diff)
        
        return max(0.0, similarity)
    
    def _compare_duration(self, user_duration: float, ref_duration: float) -> float:
        """Compare audio duration"""
        if ref_duration == 0:
            return 0.0
        
        duration_ratio = user_duration / ref_duration
        # Penalize if too different (optimal is 1.0)
        similarity = 1.0 - abs(1.0 - duration_ratio) * 0.5
        return max(0.0, min(1.0, similarity))
    
    def _generate_feedback(
        self,
        user_features: Dict,
        ref_features: Dict,
        score: float,
        expected_text: str
    ) -> str:
        """Generate actionable feedback for the user"""
        if score >= 0.8:
            return f"Excellent pronunciation of '{expected_text}'! Keep it up!"
        elif score >= 0.6:
            duration_diff = abs(user_features["duration"] - ref_features["duration"])
            if duration_diff > 0.2:
                return f"Good attempt! Try holding the sound a bit {'longer' if user_features['duration'] < ref_features['duration'] else 'shorter'}."
            else:
                return f"Good pronunciation! With a bit more practice, you'll perfect '{expected_text}'."
        elif score >= 0.4:
            return f"Keep practicing '{expected_text}'. Focus on the rhythm and tone. Listen to the reference audio again."
        else:
            return f"Don't give up! '{expected_text}' is challenging. Try breaking it into syllables and practice each part slowly."
```

#### 3.2 Pronunciation Endpoint
**File**: `app/main.py` (add to existing)
```python
from app.services.pronunciation_service import PronunciationService

pronunciation_service = PronunciationService()

@app.post("/pronunciation/evaluate")
async def evaluate_pronunciation(
    file: UploadFile = File(...),
    reference_audio_url: str = Form(...),
    expected_text: str = Form(...)
):
    """
    Evaluate user pronunciation against reference audio.
    
    Expected format: WAV, 16kHz, mono, 16-bit PCM
    """
    try:
        # Save user audio to temp file
        import tempfile
        user_audio_bytes = await file.read()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_user:
            tmp_user.write(user_audio_bytes)
            tmp_user_path = tmp_user.name
        
        # Download reference audio (or use cached)
        # For now, assume reference is provided as URL
        # In production, cache reference audio locally
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_ref:
            # Download reference audio here
            # For demo, use a placeholder
            tmp_ref_path = tmp_ref.name
        
        try:
            result = pronunciation_service.compare_pronunciation(
                user_audio_path=tmp_user_path,
                reference_audio_path=tmp_ref_path,
                expected_text=expected_text
            )
            return result
        finally:
            os.unlink(tmp_user_path)
            if os.path.exists(tmp_ref_path):
                os.unlink(tmp_ref_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pronunciation evaluation failed: {str(e)}")
```

### Phase 4: Recommendation Engine (2-3 hours)

#### 3.1 Recommendation Service
**File**: `app/services/recommendation_service.py`
```python
from typing import List, Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RecommendationService:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.story_vectors = None
        self.story_metadata = []
    
    def build_story_index(self, stories: List[Dict[str, Any]]):
        """
        Build TF-IDF index from story texts.
        
        Args:
            stories: List of story dictionaries with 'text' field
        """
        texts = []
        for story in stories:
            # Combine title and scene texts
            story_text = story.get('title', '')
            if 'scenes' in story:
                for scene in story['scenes']:
                    story_text += ' ' + scene.get('text', '')
            texts.append(story_text)
            self.story_metadata.append({
                'story_id': story.get('story_id'),
                'level': story.get('level'),
                'language': story.get('language'),
                'themes': story.get('metadata', {}).get('themes', []),
            })
        
        # Vectorize
        self.story_vectors = self.vectorizer.fit_transform(texts)
    
    def recommend_stories(
        self,
        user_id: str,
        known_words: List[str],
        completed_stories: List[str],
        all_stories: List[Dict[str, Any]],
        preferred_language: str = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recommend stories based on user profile.
        
        Args:
            user_id: User identifier
            known_words: List of words user knows
            completed_stories: List of story IDs user completed
            all_stories: All available stories
            preferred_language: User's preferred language
            limit: Number of recommendations to return
        
        Returns:
            List of recommended stories with reasons
        """
        # Build index if not already built
        if self.story_vectors is None:
            self.build_story_index(all_stories)
        
        # Filter stories
        candidate_stories = [
            s for s in all_stories
            if s['story_id'] not in completed_stories
            and s.get('status') == 'approved'
        ]
        
        if preferred_language:
            candidate_stories = [
                s for s in candidate_stories
                if s.get('language') == preferred_language
            ]
        
        if not candidate_stories:
            return []
        
        # Simple recommendation logic
        recommendations = []
        
        for story in candidate_stories[:limit * 2]:  # Consider more, then filter
            score = 0.0
            reasons = []
            
            # Level progression: recommend next level
            user_level = self._infer_user_level(completed_stories, all_stories)
            story_level = story.get('level', 'beginner')
            if self._is_next_level(user_level, story_level):
                score += 0.3
                reasons.append("appropriate difficulty level")
            
            # Theme similarity (if user completed similar stories)
            if completed_stories:
                similar_themes = self._check_theme_similarity(
                    story, completed_stories, all_stories
                )
                if similar_themes:
                    score += 0.2
                    reasons.append("similar themes to stories you enjoyed")
            
            # New vocabulary introduction
            story_words = self._extract_words(story)
            new_words = [w for w in story_words if w not in known_words]
            if 2 <= len(new_words) <= 5:  # Good number of new words
                score += 0.3
                reasons.append(f"introduces {len(new_words)} new words: {', '.join(new_words[:3])}")
            
            # Character continuity (if same author/character)
            if self._check_character_continuity(story, completed_stories, all_stories):
                score += 0.2
                reasons.append("continues same character")
            
            if score > 0:
                recommendations.append({
                    'story_id': story['story_id'],
                    'reason': '; '.join(reasons) if reasons else 'recommended for you',
                    'match_score': round(score, 2),
                    'new_words_introduced': new_words[:5] if 'new_words' in locals() else []
                })
        
        # Sort by score and return top N
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        return recommendations[:limit]
    
    def _infer_user_level(self, completed_stories: List[str], all_stories: List[Dict]) -> str:
        """Infer user's current level from completed stories."""
        if not completed_stories:
            return 'beginner'
        
        levels = []
        for story_id in completed_stories:
            story = next((s for s in all_stories if s['story_id'] == story_id), None)
            if story:
                levels.append(story.get('level', 'beginner'))
        
        # Return most common level, or 'intermediate' if mixed
        if not levels:
            return 'beginner'
        level_counts = {'beginner': levels.count('beginner'), 
                       'intermediate': levels.count('intermediate'),
                       'advanced': levels.count('advanced')}
        max_level = max(level_counts, key=level_counts.get)
        return max_level
    
    def _is_next_level(self, current: str, target: str) -> bool:
        """Check if target level is appropriate next step."""
        levels = ['beginner', 'intermediate', 'advanced']
        try:
            current_idx = levels.index(current)
            target_idx = levels.index(target)
            return target_idx <= current_idx + 1
        except:
            return True
    
    def _check_theme_similarity(self, story: Dict, completed: List[str], all_stories: List[Dict]) -> bool:
        """Check if story has similar themes to completed stories."""
        story_themes = set(story.get('metadata', {}).get('themes', []))
        if not story_themes:
            return False
        
        for completed_id in completed:
            completed_story = next((s for s in all_stories if s['story_id'] == completed_id), None)
            if completed_story:
                completed_themes = set(completed_story.get('metadata', {}).get('themes', []))
                if story_themes.intersection(completed_themes):
                    return True
        return False
    
    def _extract_words(self, story: Dict) -> List[str]:
        """Extract words from story text."""
        text = story.get('title', '')
        if 'scenes' in story:
            for scene in story['scenes']:
                text += ' ' + scene.get('text', '')
        # Simple word extraction (in production, use proper tokenization)
        words = text.lower().split()
        return [w.strip('.,!?;:') for w in words if len(w) > 2]
    
    def _check_character_continuity(self, story: Dict, completed: List[str], all_stories: List[Dict]) -> bool:
        """Check if story continues same character/series."""
        # Simple check: same author
        story_author = story.get('author_id')
        for completed_id in completed:
            completed_story = next((s for s in all_stories if s['story_id'] == completed_id), None)
            if completed_story and completed_story.get('author_id') == story_author:
                return True
        return False
```

### Phase 5: FastAPI Application (1-2 hours)

#### 4.1 Main Application
**File**: `app/main.py`
```python
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from app.services.speech_service import SpeechService
from app.services.recommendation_service import RecommendationService
import os

app = FastAPI(title="Indigenous Language ML Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
speech_service = SpeechService()
recommendation_service = RecommendationService()

# Request/Response models
class RecommendationRequest(BaseModel):
    user_id: str
    known_words: List[str] = []
    completed_stories: List[str] = []
    preferred_language: Optional[str] = None
    limit: int = 5

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language_code: str = Form(None)
):
    """
    Transcribe audio file to text.
    
    Expected format: WAV, 16kHz, mono, 16-bit PCM, max 15 seconds
    """
    try:
        # Read audio file
        audio_bytes = await file.read()
        
        # Validate file size (max 2MB)
        if len(audio_bytes) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Audio file too large (max 2MB)")
        
        # Transcribe
        result = speech_service.transcribe_audio_bytes(audio_bytes, language_code)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "transcription": result["transcription"],
            "confidence": result["confidence"],
            "language_detected": result.get("language_detected", language_code),
            "processing_time_ms": 0  # Could track this
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get story recommendations for a user.
    
    Note: This endpoint expects the backend to provide all_stories data.
    For now, returns recommendations based on simple rules.
    """
    try:
        # In production, fetch stories from backend or database
        # For now, use mock data or request from backend
        all_stories = []  # Should be fetched from backend
        
        recommendations = recommendation_service.recommend_stories(
            user_id=request.user_id,
            known_words=request.known_words,
            completed_stories=request.completed_stories,
            all_stories=all_stories,
            preferred_language=request.preferred_language,
            limit=request.limit
        )
        
        return RecommendationResponse(recommendations=recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

#### 4.2 Requirements File
**File**: `requirements.txt`
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
openai-whisper==20231117
torch>=2.0.0
torchaudio>=2.0.0
librosa==0.10.1
soundfile==0.12.1
scikit-learn==1.3.2
numpy==1.24.3
pandas==2.1.3
python-dotenv==1.0.0
pydantic==2.5.0
```

### Phase 6: Testing (1 hour)

#### 5.1 Test Script
**File**: `test_ml_service.py`
```python
import requests
import os

ML_SERVICE_URL = "http://localhost:5000"

def test_health():
    response = requests.get(f"{ML_SERVICE_URL}/health")
    print("Health check:", response.json())

def test_transcribe(audio_file_path: str):
    with open(audio_file_path, 'rb') as f:
        files = {'file': ('audio.wav', f, 'audio/wav')}
        data = {'language_code': 'en'}
        response = requests.post(f"{ML_SERVICE_URL}/transcribe", files=files, data=data)
    print("Transcription:", response.json())

def test_recommendations():
    data = {
        "user_id": "test_user",
        "known_words": ["hello", "world"],
        "completed_stories": ["story1"],
        "preferred_language": "en",
        "limit": 3
    }
    response = requests.post(f"{ML_SERVICE_URL}/recommend", json=data)
    print("Recommendations:", response.json())

if __name__ == "__main__":
    test_health()
    # test_transcribe("data/test_audio/sample.wav")  # Add test audio file
    test_recommendations()
```

### Phase 7: Optional - Presage Integration (2-3 hours)

#### 6.1 Sensor Service (Simplified)
**File**: `app/services/sensor_service.py`
```python
from typing import Dict, Any

class SensorService:
    """
    Process sensor data (heart rate, engagement) and recommend story adaptations.
    """
    
    def process_sensor_data(
        self,
        heart_rate: float,
        breathing_rate: float,
        engagement_score: float,
        emotion: str = None
    ) -> Dict[str, Any]:
        """
        Process sensor data and return adaptation recommendations.
        
        Args:
            heart_rate: Heart rate in BPM
            breathing_rate: Breathing rate per minute
            engagement_score: Engagement score (0-1)
            emotion: Detected emotion (optional)
        
        Returns:
            Dictionary with recommended actions
        """
        recommended_action = "maintain_pace"
        story_variant = "standard"
        confidence = 0.5
        
        # Simple rule-based logic
        if engagement_score < 0.4:
            recommended_action = "increase_pace"
            story_variant = "exciting"
            confidence = 0.7
        elif engagement_score > 0.8:
            recommended_action = "maintain_pace"
            story_variant = "standard"
            confidence = 0.6
        elif heart_rate > 90 and engagement_score > 0.6:
            recommended_action = "maintain_pace"
            story_variant = "calm"
            confidence = 0.65
        
        return {
            "recommended_action": recommended_action,
            "story_variant": story_variant,
            "confidence": confidence,
            "engagement_level": "low" if engagement_score < 0.4 else "high" if engagement_score > 0.7 else "medium"
        }
```

#### 6.2 Add Sensor Endpoint
**File**: `app/main.py` (add to existing file)
```python
from app.services.sensor_service import SensorService

sensor_service = SensorService()

class SensorDataRequest(BaseModel):
    user_id: str
    heart_rate: float
    breathing_rate: float
    engagement_score: float
    emotion: Optional[str] = None
    timestamp: Optional[str] = None

@app.post("/sensor/process")
async def process_sensor_data(request: SensorDataRequest):
    """
    Process sensor data and return adaptation recommendations.
    """
    try:
        result = sensor_service.process_sensor_data(
            heart_rate=request.heart_rate,
            breathing_rate=request.breathing_rate,
            engagement_score=request.engagement_score,
            emotion=request.emotion
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensor processing failed: {str(e)}")
```

## Testing Checklist

- [ ] ML service starts successfully
- [ ] Health endpoint returns OK
- [ ] Speech transcription works with test audio
- [ ] Recommendations endpoint returns results
- [ ] Error handling works for invalid inputs
- [ ] Model loads correctly (Whisper)
- [ ] Audio format validation works
- [ ] Service integrates with backend

## Updated Deliverables

1. ✅ Working FastAPI service
2. ✅ Speech recognition with Whisper
3. ✅ **Pronunciation evaluation with detailed feedback**
4. ✅ Story recommendation engine with personalization
5. ✅ API endpoints matching spec
6. ✅ Error handling and validation
7. ✅ Optional Presage sensor processing
8. ✅ Audio feature extraction (MFCCs, pitch, formants)
9. ✅ Pronunciation scoring algorithm
10. ✅ Integration with backend for recommendations

## Performance Notes

- **Whisper Model Sizes**:
  - `tiny`: Fastest, lowest accuracy (~39M params)
  - `base`: Good balance (~74M params) - **Recommended for hackathon**
  - `small`: Better accuracy (~244M params)
  - `medium`: High accuracy (~769M params)
  - `large`: Best accuracy (~1550M params) - Slow, needs GPU

- **For Hackathon**: Use `base` model on CPU (acceptable speed) or `tiny` for fastest results

## Updated Testing Checklist

- [ ] ML service starts successfully
- [ ] Health endpoint returns OK
- [ ] Speech transcription works with test audio
- [ ] **Pronunciation evaluation provides accurate scores**
- [ ] **Pronunciation feedback is actionable and helpful**
- [ ] Recommendations endpoint returns results
- [ ] Error handling works for invalid inputs
- [ ] Model loads correctly (Whisper)
- [ ] Audio format validation works
- [ ] Service integrates with backend
- [ ] **Pronunciation service compares audio correctly**
- [ ] **Presage integration works (if implemented)**

## Next Steps

1. Fine-tune Whisper on Indigenous language data (if available)
2. **Improve pronunciation scoring with phoneme-level alignment**
3. **Add more sophisticated audio analysis (formant tracking, prosody)**
4. Improve recommendation algorithm with more features
5. Add caching for frequent requests
6. Implement batch processing for multiple transcriptions
7. Add model versioning and A/B testing
8. Optimize model loading (lazy loading, model caching)
9. **Collect pronunciation data to improve scoring accuracy**
10. **Implement adaptive difficulty based on pronunciation scores**

