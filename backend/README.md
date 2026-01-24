# TurtleTalk Backend API

Production-ready Python/FastAPI backend for the AI-Powered Indigenous Language Learning Platform.

## ✅ What's Been Built

### Core Infrastructure
- ✅ **Configuration System** (`app/config.py`) - Environment-based settings with type safety
- ✅ **Database Setup** (`app/database.py`) - SQLAlchemy with connection pooling
- ✅ **FastAPI Application** (`app/main.py`) - Main app with CORS, error handling, logging
- ✅ **Authentication** (`app/utils/security.py`, `app/middleware/auth.py`) - JWT tokens, password hashing
- ✅ **Alembic Migrations** - Database migration system configured

### Database Models
- ✅ **User** - Authentication, profiles, preferences, roles
- ✅ **Course** - Language courses with levels and metadata
- ✅ **Lesson** - Course lessons with content and exercises
- ✅ **Exercise** - Quizzes and practice exercises
- ✅ **Progress** - User progress tracking (overall + per-lesson)
- ✅ **Story** - Community stories and interactive narratives
- ✅ **StoryScene** - Story scenes with choices

### API Routes
- ✅ **Authentication** (`/api/v1/auth/*`) - Register, login
- ✅ **Users** (`/api/v1/users/*`) - Profile management
- ✅ **Courses** (`/api/v1/courses/*`) - List, get courses
- ✅ **Lessons** (`/api/v1/lessons/*`) - Get lessons
- ✅ **Stories** (`/api/v1/stories/*`) - List, get stories
- ✅ **Voice** (`/api/v1/voice/*`) - Audio transcription, pronunciation
- ✅ **AI Tutor** (`/api/v1/ai-tutor/*`) - Gemini chat integration

### Pydantic Schemas
- ✅ Request/response validation for all endpoints
- ✅ Type-safe data models
- ✅ Automatic API documentation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings:
# - DATABASE_URL (PostgreSQL or SQLite)
# - SECRET_KEY (generate a strong key)
# - GEMINI_API_KEY
# - ELEVENLABS_API_KEY
```

### 3. Set Up Database

**PostgreSQL:**
```bash
createdb turtletalk_db
```

**Or SQLite (for development):**
```bash
# In .env: DATABASE_URL=sqlite:///./turtletalk.db
```

### 4. Run Migrations

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run Server

```bash
python run.py
```

Server runs at `http://localhost:3001`

## 📚 API Documentation

Once running:
- **Swagger UI**: `http://localhost:3001/docs`
- **ReDoc**: `http://localhost:3001/redoc`
- **Health Check**: `http://localhost:3001/health`

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI app, routes, middleware
│   ├── config.py            # Configuration (env vars)
│   ├── database.py          # DB connection, session management
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── lesson.py
│   │   ├── exercise.py
│   │   ├── progress.py
│   │   └── story.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── course.py
│   │   └── ...
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── courses.py
│   │   └── ...
│   ├── services/            # Business logic (to be implemented)
│   ├── middleware/          # Auth middleware
│   └── utils/               # Utilities (security, etc.)
├── alembic/                 # Database migrations
├── .env                     # Environment variables
├── .env.example             # Environment template
├── requirements.txt         # Dependencies
└── run.py                   # Server entry point
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT access tokens (30 min expiry)
- ✅ JWT refresh tokens (7 day expiry)
- ✅ Protected routes with authentication
- ✅ Optional authentication for public routes
- ✅ CORS configuration
- ✅ Input validation with Pydantic

## 📝 Environment Variables

See `.env.example` for all available configuration options:

- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - JWT signing key (min 32 chars)
- `GEMINI_API_KEY` - Google Gemini API key
- `ELEVENLABS_API_KEY` - ElevenLabs TTS API key
- `CORS_ORIGINS` - Allowed frontend origins
- And more...

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test API docs
open http://localhost:3001/docs
```

## 📋 Next Steps

1. **Install Dependencies**: `pip install -r requirements.txt`
2. **Configure Database**: Set `DATABASE_URL` in `.env`
3. **Run Migrations**: `alembic upgrade head`
4. **Start Server**: `python run.py`
5. **Test API**: Visit `/docs` for interactive API testing

## 🔄 Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 📖 See Also

- [BACKEND_PLAN.md](../BACKEND_PLAN.md) - Detailed development plan
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Setup guide
- [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md) - API specifications
