# Backend API - Indigenous Language Platform

Python/FastAPI backend for the Indigenous Language Platform.

## Quick Start

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
python -c "from app.database import init_db; init_db()"

# Seed database (optional)
python scripts/seed.py

# Run server
python run.py
```

Server will be available at `http://localhost:3001`

## API Documentation

FastAPI automatically generates interactive API documentation:
- Swagger UI: `http://localhost:3001/docs`
- ReDoc: `http://localhost:3001/redoc`

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routes/            # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Auth middleware
│   └── utils/               # Utilities
├── scripts/                 # Seed scripts
└── requirements.txt
```

## Development

The server runs with auto-reload enabled. Changes to code will automatically restart the server.

## See Also

- [BACKEND_PLAN.md](../BACKEND_PLAN.md) - Detailed development plan
- [TECHNICAL_SPEC.md](../TECHNICAL_SPEC.md) - API specifications

