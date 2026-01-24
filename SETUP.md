# Setup Guide

This guide will help you set up the development environment for the Indigenous Language Platform.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/)) or Docker
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

## Quick Start

### 1. Clone and Navigate
```bash
cd /Users/jingyu/HackHive
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# macOS: brew install postgresql@14
# Start PostgreSQL
brew services start postgresql@14

# Create database
createdb indigenous_language_platform

# Or using psql:
psql postgres
CREATE DATABASE indigenous_language_platform;
\q
```

#### Option B: Docker PostgreSQL
```bash
docker run --name indigenous-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=indigenous_language_platform \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=indigenous_language_platform
# DB_USER=postgres
# DB_PASSWORD=postgres

# Initialize database tables
python -c "from app.database import init_db; init_db()"

# Seed database (optional)
python scripts/seed.py

# Start backend
python run.py
# Or: uvicorn app.main:app --reload --port 3001
```

Backend should be running on `http://localhost:3001`

### 4. ML Service Setup

```bash
cd ml-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Download Whisper models (happens automatically on first use)
# This may take a few minutes

# Start ML service
python -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

ML Service should be running on `http://localhost:5000`

**Note**: First run will download Whisper model (~150MB for base model). This may take a few minutes.

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:3001/api

# Start frontend
npm start
```

Frontend should open at `http://localhost:3000`

## Verification

### Test Backend
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test ML Service
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","service":"ml-service"}
```

### Test Frontend
Open `http://localhost:3000` in browser - should see the app.

## Development Workflow

### Running All Services

You'll need three terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python run.py
```

**Terminal 2 - ML Service:**
```bash
cd ml-service
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Database Seeding

To populate the database with sample data:

```bash
cd backend
source venv/bin/activate
python scripts/seed.py
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Sample story: "The Morning Song"

## Common Issues

### Port Already in Use
If port 3001, 3000, or 5000 is in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: React will prompt to use different port
- ML Service: Change `PORT` in `ml-service/.env`

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l | grep indigenous`

### Whisper Model Download Fails
- Check internet connection
- Model downloads to `~/.cache/whisper/` on first use
- Manually download: `whisper --model base` (in Python)

### CORS Errors
- Ensure backend has CORS enabled (should be in `app.ts`)
- Check `REACT_APP_API_URL` in frontend `.env`

### Audio/Microphone Issues
- Browser requires HTTPS for microphone access (except localhost)
- Grant microphone permissions when prompted
- Test in Chrome/Edge (best Web Speech API support)

## Environment Variables Reference

### Backend (.env)
```
PORT=3001
HOST=0.0.0.0
DEBUG=True
DB_HOST=localhost
DB_PORT=5432
DB_NAME=indigenous_language_platform
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=3600
ML_SERVICE_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:3000
```

### ML Service (.env)
```
HOST=0.0.0.0
PORT=5000
ASR_MODEL=base
ASR_DEVICE=cpu
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Next Steps

1. Read your component's execution plan:
   - Frontend: `FRONTEND_PLAN.md`
   - Backend: `BACKEND_PLAN.md`
   - ML: `ML_PLAN.md`

2. Review technical specifications: `TECHNICAL_SPEC.md`

3. Start building! Each developer can work independently following their plan.

## Production Deployment

For deployment to DigitalOcean:

1. **Backend**: Deploy Node.js app (App Platform or Droplet)
2. **ML Service**: Deploy Python service (separate Droplet or container)
3. **Frontend**: Build static files (`npm run build`) and serve via CDN
4. **Database**: Use DigitalOcean Managed PostgreSQL
5. **Storage**: Use DigitalOcean Spaces for media files

See deployment guides in each component's plan document.

