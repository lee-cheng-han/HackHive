# Backend Setup Guide

## Quick Start

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
# Edit .env with your database credentials and API keys
```

### 3. Set Up Database

**Option A: PostgreSQL (Recommended for Production)**
```bash
# Create database
createdb turtletalk_db

# Or using psql:
psql -U postgres
CREATE DATABASE turtletalk_db;
```

**Option B: SQLite (For Local Development)**
```bash
# Update .env:
# DATABASE_URL=sqlite:///./turtletalk.db
```

### 4. Run Database Migrations

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

Server will be available at `http://localhost:3001`

## API Documentation

Once the server is running:
- **Swagger UI**: `http://localhost:3001/docs`
- **ReDoc**: `http://localhost:3001/redoc`

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Auth middleware
│   └── utils/               # Utilities
├── alembic/                 # Database migrations
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── requirements.txt         # Python dependencies
└── run.py                   # Server entry point
```

## Key Features

✅ **Production-Ready Foundation**
- Environment-based configuration
- Database connection pooling
- Error handling and logging
- CORS configuration
- JWT authentication

✅ **Database Models**
- User management with roles
- Course and lesson structure
- Exercise and quiz system
- Progress tracking
- Community stories

✅ **API Routes**
- Authentication (register/login)
- User management
- Courses and lessons
- Stories
- Voice processing
- AI tutor integration

✅ **Security**
- Password hashing (bcrypt)
- JWT tokens (access + refresh)
- Protected routes
- Optional user authentication

## Next Steps

1. **Configure API Keys**: Add your Gemini and ElevenLabs API keys to `.env`
2. **Set Up Database**: Create PostgreSQL database or use SQLite
3. **Run Migrations**: Initialize database schema
4. **Test API**: Use Swagger UI at `/docs` to test endpoints
5. **Implement Services**: Add business logic in `app/services/`

## Development

The server runs with auto-reload enabled in development mode. Changes to code will automatically restart the server.

## Production Deployment

1. Set `ENVIRONMENT=production` in `.env`
2. Set `DEBUG=False`
3. Use a strong `SECRET_KEY`
4. Configure proper CORS origins
5. Use PostgreSQL database
6. Set up proper logging

