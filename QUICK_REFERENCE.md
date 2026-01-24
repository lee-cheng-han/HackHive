# Quick Reference Guide

Quick lookup for common tasks and information.

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get token

### Stories
- `GET /api/stories` - List stories (filters: ?language=cr&level=beginner)
- `GET /api/stories/{story_id}` - Get full story
- `POST /api/stories` - Submit story (requires contributor role)

### Voice
- `POST /api/voice-to-text` - Transcribe audio (multipart/form-data)

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/progress` - Update learning progress
- `GET /api/recommendations` - Get story recommendations

### ML Service
- `POST /transcribe` - Speech recognition
- `POST /recommend` - Get recommendations
- `POST /sensor/process` - Process sensor data (optional)

## Data Formats

### Audio Input
- Format: `.wav`
- Sample Rate: 16,000 Hz
- Channels: Mono
- Encoding: PCM 16-bit
- Max Duration: 15 seconds

### Story JSON Structure
```json
{
  "story_id": "uuid",
  "language": "cr",
  "title": "Story Title",
  "scenes": [
    {
      "id": "scene1",
      "text": "Scene text",
      "choices": [...]
    }
  ]
}
```

## Language Codes
- `cr` - Cree
- `iu` - Inuktitut
- `haw` - Hawaiian
- `oj` - Ojibwe
- `chr` - Cherokee

## Default Credentials (Development)
- Email: `admin@example.com`
- Password: `admin123`

## Ports
- Frontend: `3000`
- Backend: `3001`
- ML Service: `5000`
- PostgreSQL: `5432`

## Common Commands

### Backend
```bash
source venv/bin/activate
python run.py              # Start development server
python scripts/seed.py     # Seed database
# FastAPI auto-reloads on code changes
```

### Frontend
```bash
npm start          # Start dev server
npm run build      # Build for production
```

### ML Service
```bash
source venv/bin/activate
uvicorn app.main:app --reload
```

## File Naming Conventions

- Images: `/media/images/{story_id}/{scene_id}.png`
- Audio: `/media/audio/{story_id}/{scene_id}.mp3`
- Thumbnails: `/media/images/{story_id}/thumbnail.png`

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Testing URLs

- Backend Health: `http://localhost:3001/health`
- ML Service Health: `http://localhost:5000/health`
- Frontend: `http://localhost:3000`

## JWT Token Usage

Include in request header:
```
Authorization: Bearer <token>
```

Token expires in 1 hour (configurable).

