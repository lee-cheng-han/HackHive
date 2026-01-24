# Project Overview: AI-Powered Indigenous Language Platform

## Mission

Build a voice-first, community-driven platform that enables Indigenous communities to preserve and teach their languages through engaging, interactive storytelling.

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│  React App with Voice-First Chat Interface              │
│  - Voice input/output                                    │
│  - Story rendering                                        │
│  - Accessibility features                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
                   │
┌──────────────────▼──────────────────────────────────────┐
│                    BACKEND                              │
│  Node.js/Express API                                    │
│  - User management                                       │
│  - Story content management                              │
│  - Community features                                    │
│  - Media storage                                         │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  ML SERVICE                             │
│  Python FastAPI                                         │
│  - Speech recognition (Whisper)                          │
│  - Story recommendations                                 │
│  - Sensor processing (optional)                          │
└─────────────────────────────────────────────────────────┘
```

## Three-Component Development Strategy

### Component 1: Frontend
**Developer**: Frontend Team Member  
**Focus**: User experience, voice interactions, accessibility  
**Key Technologies**: React, Web Speech API, Material-UI  
**Deliverable**: Responsive web app with chat-style storytelling interface

**See**: `FRONTEND_PLAN.md` for detailed execution steps

### Component 2: Backend
**Developer**: Backend Team Member  
**Focus**: API, database, user management, content moderation  
**Key Technologies**: Node.js/Express, PostgreSQL, JWT  
**Deliverable**: RESTful API with authentication and story management

**See**: `BACKEND_PLAN.md` for detailed execution steps

### Component 3: ML Service
**Developer**: ML/AI Team Member  
**Focus**: Speech recognition, recommendations, sensor integration  
**Key Technologies**: Python, FastAPI, Whisper, scikit-learn  
**Deliverable**: ML microservice for speech and personalization

**See**: `ML_PLAN.md` for detailed execution steps

## Key Features

### 1. Voice-First Interaction
- Users can speak commands and responses
- Audio narration for stories
- Speech-to-text transcription
- Visual cues and subtitles

### 2. Interactive Storytelling
- Choose-your-own-adventure style branching
- Dynamic content with images and audio
- Personalized story paths
- Progress tracking

### 3. Community Platform
- Community members can submit stories
- Content moderation workflow
- Comments and ratings
- Multi-language and dialect support

### 4. AI-Powered Personalization
- Story recommendations based on progress
- Adaptive difficulty
- Vocabulary tracking
- Optional: Sensor-based emotion adaptation

### 5. Accessibility
- Adjustable font sizes
- High contrast mode
- Text highlighting during narration
- Keyboard navigation
- Screen reader support

## Technical Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React + TypeScript | User interface |
| Backend | Python + FastAPI | API server |
| Database | PostgreSQL | Data storage |
| ML Service | Python + FastAPI | AI/ML processing |
| ASR | OpenAI Whisper | Speech recognition |
| Auth | JWT | Authentication |
| Storage | Local/S3/Spaces | Media files |

## Data Flow Examples

### User Speaks → Story Progresses
1. User speaks into microphone (Frontend)
2. Audio sent to Backend (`POST /api/voice-to-text`)
3. Backend forwards to ML Service (`POST /transcribe`)
4. ML Service returns transcription
5. Backend processes and returns to Frontend
6. Frontend updates story based on response

### Story Recommendation
1. User completes a story (Frontend)
2. Frontend calls `GET /api/recommendations` (Backend)
3. Backend calls ML Service (`POST /recommend`)
4. ML Service analyzes user profile and story data
5. Returns ranked recommendations
6. Frontend displays suggested stories

## Development Timeline (Hackathon)

### Day 1: Setup & Core Features
- **Morning**: Project setup, database, basic API
- **Afternoon**: Frontend UI, basic story rendering
- **Evening**: Voice input integration

### Day 2: Integration & Polish
- **Morning**: Connect all components, test integration
- **Afternoon**: Add recommendations, community features
- **Evening**: Testing, bug fixes, demo preparation

## Success Criteria

✅ Users can register and log in  
✅ Stories can be created and viewed  
✅ Voice input captures and transcribes speech  
✅ Story recommendations work  
✅ UI is accessible and responsive  
✅ All three components integrate successfully  

## Getting Started

1. **Read**: `SETUP.md` for environment setup
2. **Choose**: Your component (Frontend/Backend/ML)
3. **Follow**: Your component's execution plan
4. **Reference**: `TECHNICAL_SPEC.md` for API contracts
5. **Build**: Start coding!

## Documentation Structure

- **README.md** - Project introduction
- **ARCHITECTURE.md** - System design and component interactions
- **TECHNICAL_SPEC.md** - API contracts, data formats, requirements
- **FRONTEND_PLAN.md** - Step-by-step frontend development guide
- **BACKEND_PLAN.md** - Step-by-step backend development guide
- **ML_PLAN.md** - Step-by-step ML service development guide
- **SETUP.md** - Development environment setup
- **QUICK_REFERENCE.md** - Quick lookup for common tasks

## Support & Communication

- Use `TECHNICAL_SPEC.md` as the source of truth for API contracts
- Coordinate API changes with the team
- Test integration early and often
- Use mock data if other components aren't ready

## Next Steps

1. **All Developers**: Run through `SETUP.md`
2. **Frontend Dev**: Start with `FRONTEND_PLAN.md` Phase 1
3. **Backend Dev**: Start with `BACKEND_PLAN.md` Phase 1
4. **ML Dev**: Start with `ML_PLAN.md` Phase 1
5. **Team**: Meet after Phase 1 to verify integration points

Good luck! 🚀

