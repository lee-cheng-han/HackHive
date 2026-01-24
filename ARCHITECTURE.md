# System Architecture

## Overview

The platform follows a microservices architecture with three main components that communicate via well-defined APIs.

```
┌─────────────┐
│   Frontend  │ (React Web App)
│  (Browser)  │
└──────┬──────┘
       │ HTTP/REST
       │ WebSocket (optional)
       │
┌──────▼─────────────────────────────────────┐
│           Backend API                      │
│  (Python/FastAPI)                          │
│  - User Management                         │
│  - Story Content Management                │
│  - Community Features                      │
│  - Media Storage                           │
└──────┬─────────────────────────────────────┘
       │
       │ HTTP/REST
       │
┌──────▼─────────────────────────────────────┐
│         ML Service                         │
│  (Python Flask/FastAPI)                    │
│  - Speech Recognition (ASR)                │
│  - Story Recommendations                   │
│  - Sensor Data Processing                  │
└────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend
- **Location**: `/frontend`
- **Technology**: React, Web Speech API
- **Responsibilities**:
  - Voice-first UI with chat interface
  - Story rendering with images/audio
  - Voice input capture and playback
  - User interaction and choices
  - Accessibility features

### Backend
- **Location**: `/backend`
- **Technology**: Python/FastAPI, PostgreSQL, SQLAlchemy
- **Responsibilities**:
  - User authentication and profiles
  - Story content CRUD operations
  - Content moderation workflow
  - Community features (comments, ratings)
  - Media file management
  - API gateway to ML service

### ML Service
- **Location**: `/ml-service`
- **Technology**: Python, Flask/FastAPI, PyTorch
- **Responsibilities**:
  - Speech-to-text transcription
  - Story recommendation engine
  - Sensor data processing (optional)
  - NLP analysis for personalization

## Data Flow

### Voice Input Flow
```
User speaks → Frontend captures audio (.wav)
  → POST /api/voice-to-text (Backend)
  → POST /transcribe (ML Service)
  → ML Service returns transcription
  → Backend returns to Frontend
  → Frontend displays/processes text
```

### Story Retrieval Flow
```
User requests story → Frontend calls GET /api/stories/{id}
  → Backend queries database
  → Returns story JSON with media URLs
  → Frontend renders story scenes
```

### Recommendation Flow
```
User completes story → Frontend calls GET /api/recommendations
  → Backend calls POST /recommend (ML Service)
  → ML Service analyzes user profile
  → Returns ranked story list
  → Backend returns to Frontend
```

## Database Schema (High Level)

```
Users
  - user_id, email, password_hash, preferred_language, created_at

Stories
  - story_id, title, language, dialect, level, author_id, status, created_at

Story_Scenes
  - scene_id, story_id, scene_order, text, image_url, audio_url, choices_json

User_Progress
  - user_id, story_id, current_scene, status, completed_at

Comments
  - comment_id, story_id, user_id, text, created_at

Languages
  - language_code, name, native_name

Dialects
  - dialect_id, language_code, name
```

## API Communication

All APIs use JSON for request/response bodies. See [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) for detailed contracts.

### Frontend ↔ Backend
- REST API over HTTPS
- Authentication via JWT tokens
- Media files via CDN URLs

### Backend ↔ ML Service
- REST API (internal)
- Can be HTTP or gRPC for better performance
- Async processing for long operations

## Security Considerations

- JWT tokens for authentication
- Password hashing (bcrypt)
- HTTPS for all communications
- Input validation and sanitization
- Role-based access control (RBAC)
- Media upload validation
- Rate limiting on APIs

## Scalability

- Stateless API servers (can scale horizontally)
- Database connection pooling
- CDN for media assets
- Caching layer (Redis) for frequent reads
- Load balancer for multiple instances

## Deployment Architecture

```
DigitalOcean Droplet/App Platform
├── Frontend (Static files on CDN or served by Nginx)
├── Backend API (Python/FastAPI)
├── PostgreSQL Database
├── ML Service (Python, can be separate droplet)
└── Media Storage (S3/DigitalOcean Spaces)
```

