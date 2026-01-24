# Technical Specifications & Data Formats

This document defines all technical requirements, data formats, and API contracts to ensure consistency across all components.

## Audio & Voice Specifications

### Voice Input (Frontend → Backend/ML)

**Format**: `.wav`  
**Encoding**: PCM 16-bit  
**Sample Rate**: 16,000 Hz (16kHz)  
**Channels**: Mono (1 channel)  
**Max Duration**: 15 seconds  
**Max File Size**: 2 MB

**API Endpoint**: `POST /api/voice-to-text`

**Request**:
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: audio file (.wav)
  - `language_code`: string (e.g., 'cr' for Cree, 'iu' for Inuktitut, 'haw' for Hawaiian)

**Response** (Success - 200):
```json
{
  "transcription": "tansi nitotem",
  "confidence": 0.91,
  "language_detected": "cr"
}
```

**Response** (Error - 400):
```json
{
  "error": "Invalid audio format",
  "message": "Audio must be WAV format, 16kHz, mono, 16-bit PCM"
}
```

### Voice Output (Text-to-Speech)

**Format**: `.mp3` (preferred) or `.wav`  
**Bitrate**: 128 kbps (for MP3)  
**Sample Rate**: 22,050 Hz or 44,100 Hz  
**Channels**: Mono or Stereo

**Delivery**: 
- Pre-synthesized audio files hosted on CDN
- URL format: `/media/audio/{story_id}/{scene_id}.mp3`
- Fallback: Browser SpeechSynthesis API for dynamic TTS

## Story Content Format

### Story Structure (Backend → Frontend)

**Endpoint**: `GET /api/stories/{story_id}`

**Response**:
```json
{
  "story_id": "story123",
  "language": "cr",
  "dialect": "plains_cree",
  "title": "The Morning Song",
  "title_translation": "The Morning Song",
  "level": "beginner",
  "author": {
    "user_id": "user789",
    "name": "Elder Jean"
  },
  "metadata": {
    "age_range": "5-10",
    "themes": ["nature", "animals"],
    "vocabulary_count": 25,
    "estimated_duration_minutes": 5
  },
  "scenes": [
    {
      "id": "scene1",
      "order": 1,
      "text": "Tānisi! My name is Miyo.",
      "text_translation": "Hello! My name is Miyo.",
      "image_url": "/media/images/story123/scene1.png",
      "audio_url": "/media/audio/story123/scene1.mp3",
      "choices": [
        {
          "id": "choice1",
          "text": "Hello!",
          "text_translation": "Hello!",
          "next_scene": "scene2a",
          "voice_prompt": "Say 'Tānisi' to greet Miyo"
        },
        {
          "id": "choice2",
          "text": "Who are you?",
          "text_translation": "Who are you?",
          "next_scene": "scene2b"
        }
      ],
      "interaction_type": "choice" // or "voice_response", "continue"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Story List (Backend → Frontend)

**Endpoint**: `GET /api/stories?language={code}&level={level}&limit={n}&offset={n}`

**Response**:
```json
{
  "stories": [
    {
      "story_id": "story123",
      "title": "The Morning Song",
      "language": "cr",
      "level": "beginner",
      "thumbnail_url": "/media/images/story123/thumbnail.png",
      "author": {
        "name": "Elder Jean"
      },
      "rating": 4.5,
      "completion_count": 120
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

## User Profile Format

### User Object

```json
{
  "user_id": "user456",
  "email": "student@example.com",
  "name": "Alex",
  "preferred_language": "cr",
  "preferred_dialect": "plains_cree",
  "profile": {
    "avatar_url": "/media/avatars/user456.png",
    "bio": "Learning Cree with my family"
  },
  "learning_data": {
    "known_words": ["tansi", "ninanaskomon", "miyo"],
    "words_learning": ["kisikaw", "nipiy"],
    "completed_stories": ["story123", "story087"],
    "in_progress_stories": [
      {
        "story_id": "story200",
        "current_scene": "scene3",
        "progress_percent": 60
      }
    ],
    "total_stories_completed": 5,
    "total_words_learned": 45
  },
  "settings": {
    "font_size": "medium", // small, medium, large
    "high_contrast": false,
    "subtitles_enabled": true,
    "voice_input_enabled": true,
    "kids_mode": false
  },
  "created_at": "2024-01-10T08:00:00Z"
}
```

## API Endpoints

### Authentication

**POST /api/auth/register**
```json
Request: {
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name",
  "preferred_language": "cr"
}

Response: {
  "user_id": "user456",
  "token": "jwt_token_here",
  "expires_in": 3600
}
```

**POST /api/auth/login**
```json
Request: {
  "email": "user@example.com",
  "password": "securepassword"
}

Response: {
  "user_id": "user456",
  "token": "jwt_token_here",
  "expires_in": 3600
}
```

### Stories

**GET /api/stories** - List stories with filters
**GET /api/stories/{story_id}** - Get full story content
**POST /api/stories** - Submit new story (requires contributor role)
**PUT /api/stories/{story_id}** - Update story (author or admin only)
**DELETE /api/stories/{story_id}** - Delete story (admin only)

### User Progress

**GET /api/user/progress** - Get user's learning progress
**POST /api/user/progress** - Update progress
```json
Request: {
  "story_id": "story123",
  "current_scene": "scene5",
  "status": "in_progress" // or "completed"
}
```

### Recommendations

**GET /api/recommendations**
```json
Response: {
  "recommended": [
    {
      "story_id": "story211",
      "reason": "Continues same character",
      "match_score": 0.85
    },
    {
      "story_id": "story302",
      "reason": "Introduces 2 new words: kisikaw, nipiy",
      "match_score": 0.72
    }
  ]
}
```

### Voice Processing

**POST /api/voice-to-text** - Transcribe audio (see Audio specs above)

### Community Features

**GET /api/stories/{story_id}/comments** - Get comments
**POST /api/stories/{story_id}/comments** - Add comment
**POST /api/stories/{story_id}/rate** - Rate story (1-5 stars)

## ML Service API

### Speech Recognition

**POST /transcribe**
```json
Request: multipart/form-data
  - file: audio.wav
  - language_code: "cr"

Response: {
  "transcription": "tansi nitotem",
  "confidence": 0.91,
  "language_detected": "cr",
  "processing_time_ms": 450
}
```

### Recommendations

**POST /recommend**
```json
Request: {
  "user_id": "user456",
  "known_words": ["tansi", "miyo"],
  "completed_stories": ["story123", "story087"],
  "preferred_language": "cr",
  "limit": 5
}

Response: {
  "recommendations": [
    {
      "story_id": "story211",
      "reason": "continues_same_character",
      "match_score": 0.85,
      "new_words_introduced": ["kisikaw"]
    }
  ]
}
```

### Sensor Data (Optional)

**POST /sensor/process**
```json
Request: {
  "user_id": "user456",
  "heart_rate": 72,
  "breathing_rate": 16,
  "engagement_score": 0.65,
  "emotion": "focused",
  "timestamp": "2024-01-15T10:30:00Z"
}

Response: {
  "recommended_action": "increase_pace",
  "story_variant": "exciting",
  "confidence": 0.78
}
```

## Media File Naming Conventions

- **Images**: `/media/images/{story_id}/{scene_id}.{ext}`
  - Example: `/media/images/story123/scene1.png`
- **Audio**: `/media/audio/{story_id}/{scene_id}.{ext}`
  - Example: `/media/audio/story123/scene1.mp3`
- **Thumbnails**: `/media/images/{story_id}/thumbnail.{ext}`
- **User Avatars**: `/media/avatars/{user_id}.{ext}`

## Language Codes

Use ISO 639-2 or 639-3 codes:
- `cr` - Cree
- `iu` - Inuktitut
- `haw` - Hawaiian
- `oj` - Ojibwe
- `chr` - Cherokee

## Error Response Format

All error responses follow this format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {} // optional additional info
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (e.g., duplicate email)
- 500: Internal Server Error

## Database Field Types

- **IDs**: UUID (v4) or auto-incrementing integers
- **Timestamps**: ISO 8601 format (UTC)
- **Text**: UTF-8 encoding (supports Unicode for Indigenous characters)
- **JSON Fields**: Use JSONB in PostgreSQL for flexible story metadata

## Security Requirements

- **Password**: Minimum 8 characters, hashed with bcrypt (cost factor 10+)
- **JWT Tokens**: 
  - Algorithm: HS256 or RS256
  - Expiration: 1 hour (access), 7 days (refresh)
  - Include: user_id, email, role
- **CORS**: Configure allowed origins for frontend domain
- **Rate Limiting**: 100 requests/minute per IP, 10 requests/minute for voice-to-text

## Performance Targets

- **API Response Time**: < 200ms for simple queries, < 500ms for complex
- **Voice Transcription**: < 2 seconds for 15-second audio
- **Story Loading**: < 1 second for story content
- **Media Loading**: CDN with < 500ms first byte

