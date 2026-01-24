# Backend Development Plan

**Developer**: Backend Team Member  
**Component**: Community Platform API  
**Technology Stack**: Python/FastAPI, PostgreSQL, SQLAlchemy, JWT Auth

## Overview

Build a RESTful API backend that handles user management, story content management, community features, and acts as a gateway to the ML service.

## Prerequisites

- Python 3.9+
- PostgreSQL 14+ (or Docker for local DB)
- pip and virtualenv
- Postman or similar for API testing
- Git

## Step-by-Step Execution Plan

### Phase 1: Project Setup (30 minutes)

#### 1.1 Initialize Python Project
```bash
cd /Users/jingyu/HackHive
mkdir backend
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
```

#### 1.2 Install Dependencies
```bash
# Web framework
pip install fastapi uvicorn[standard] python-multipart

# Database
pip install sqlalchemy psycopg2-binary alembic

# Authentication
pip install python-jose[cryptography] passlib[bcrypt] python-multipart

# Validation
pip install pydantic[email] email-validator

# Utilities
pip install python-dotenv python-dateutil

# CORS
pip install python-multipart
```

#### 1.3 Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── story.py
│   │   ├── story_scene.py
│   │   └── comment.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── story.py
│   │   └── auth.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── stories.py
│   │   ├── users.py
│   │   └── voice.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ml_service.py      # ML service client
│   │   └── storage_service.py  # File upload service
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py
│   └── utils/
│       ├── __init__.py
│       └── security.py
├── alembic/                 # Database migrations
├── .env
├── .env.example
├── requirements.txt
└── README.md
```

#### 1.4 Environment Variables
**File**: `.env.example`
```
# Server
PORT=3001
HOST=0.0.0.0
DEBUG=True

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=indigenous_language_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN=3600  # seconds (1 hour)

# ML Service
ML_SERVICE_URL=http://localhost:5000

# Storage (S3/DigitalOcean Spaces)
STORAGE_TYPE=local
# STORAGE_TYPE=s3
# STORAGE_BUCKET=your-bucket-name
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_REGION=us-east-1

# CORS
CORS_ORIGINS=http://localhost:3000
```

#### 1.5 Requirements File
**File**: `requirements.txt`
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic[email]==2.5.0
email-validator==2.1.0
python-dotenv==1.0.0
python-dateutil==2.8.2
httpx==0.25.2  # For calling ML service
```

### Phase 2: Database Setup (1 hour)

#### 2.1 Database Configuration
**File**: `app/database.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### 2.2 User Model
**File**: `app/models/user.py`
```python
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    LEARNER = "learner"
    CONTRIBUTOR = "contributor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    preferred_language = Column(String(10), nullable=False, default="en")
    preferred_dialect = Column(String(50), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.LEARNER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### 2.3 Story Model
**File**: `app/models/story.py`
```python
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base

class StoryLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class StoryStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Story(Base):
    __tablename__ = "stories"

    story_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    title_translation = Column(String, nullable=True)
    language = Column(String(10), nullable=False)
    dialect = Column(String(50), nullable=True)
    level = Column(Enum(StoryLevel), default=StoryLevel.BEGINNER, nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    status = Column(Enum(StoryStatus), default=StoryStatus.PENDING, nullable=False)
    metadata = Column(JSON, nullable=True, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", backref="stories")
    scenes = relationship("StoryScene", back_populates="story", order_by="StoryScene.scene_order")
```

#### 2.4 Story Scene Model
**File**: `app/models/story_scene.py`
```python
from sqlalchemy import Column, String, Integer, ForeignKey, Enum, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base

class InteractionType(str, enum.Enum):
    CHOICE = "choice"
    VOICE_RESPONSE = "voice_response"
    CONTINUE = "continue"

class StoryScene(Base):
    __tablename__ = "story_scenes"

    scene_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    story_id = Column(UUID(as_uuid=True), ForeignKey("stories.story_id"), nullable=False)
    scene_order = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    text_translation = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    audio_url = Column(String, nullable=True)
    choices_json = Column(JSON, nullable=True, default=[])
    interaction_type = Column(Enum(InteractionType), default=InteractionType.CONTINUE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    story = relationship("Story", back_populates="scenes")
```

#### 2.5 Initialize Models
**File**: `app/models/__init__.py`
```python
from app.models.user import User
from app.models.story import Story
from app.models.story_scene import StoryScene

__all__ = ["User", "Story", "StoryScene"]
```

#### 2.6 Database Initialization
**File**: `app/database.py` (add to existing)
```python
# ... existing code ...

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
```

### Phase 3: Authentication (1-2 hours)

#### 3.1 Security Utilities
**File**: `app/utils/security.py`
```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRES_IN", 3600)) // 60

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

#### 3.2 Auth Middleware
**File**: `app/middleware/auth.py`
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.security import decode_access_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user

def require_role(*allowed_roles):
    """Require specific role(s)"""
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role.value not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker
```

#### 3.3 Auth Schemas
**File**: `app/schemas/auth.py`
```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    preferred_language: str = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    user_id: str
    token: str
    expires_in: int
```

#### 3.4 Auth Routes
**File**: `app/routes/auth.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.utils.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        preferred_language=user_data.preferred_language,
        role=User.UserRole.LEARNER
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create token
    access_token = create_access_token(data={"user_id": str(new_user.user_id)})
    
    return TokenResponse(
        user_id=str(new_user.user_id),
        token=access_token,
        expires_in=3600
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(data={"user_id": str(user.user_id)})
    
    return TokenResponse(
        user_id=str(user.user_id),
        token=access_token,
        expires_in=3600
    )
```

### Phase 4: Story Management (2-3 hours)

#### 4.1 Story Schemas
**File**: `app/schemas/story.py`
```python
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class Choice(BaseModel):
    id: str
    text: str
    text_translation: Optional[str] = None
    next_scene: str
    voice_prompt: Optional[str] = None

class StoryScene(BaseModel):
    id: str
    order: int
    text: str
    text_translation: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    choices: Optional[List[Choice]] = []
    interaction_type: str

    class Config:
        from_attributes = True

class StoryResponse(BaseModel):
    story_id: str
    language: str
    dialect: Optional[str] = None
    title: str
    title_translation: Optional[str] = None
    level: str
    author: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = {}
    scenes: List[StoryScene]
    created_at: datetime
    updated_at: datetime

class StoryListItem(BaseModel):
    story_id: str
    title: str
    language: str
    level: str
    thumbnail_url: Optional[str] = None
    author: Dict[str, str]
    rating: float = 0.0
    completion_count: int = 0

class StoryListResponse(BaseModel):
    stories: List[StoryListItem]
    total: int
    limit: int
    offset: int

class StoryCreate(BaseModel):
    title: str
    title_translation: Optional[str] = None
    language: str
    dialect: Optional[str] = None
    level: str
    scenes: List[Dict[str, Any]]
    metadata: Optional[Dict[str, Any]] = {}
```

#### 4.2 Story Routes
**File**: `app/routes/stories.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.story import Story, StoryStatus
from app.models.story_scene import StoryScene
from app.models.user import User
from app.middleware.auth import get_current_user, require_role
from app.schemas.story import StoryResponse, StoryListResponse, StoryListItem, StoryCreate

router = APIRouter(prefix="/stories", tags=["stories"])

@router.get("/", response_model=StoryListResponse)
async def list_stories(
    language: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List stories with optional filters"""
    query = db.query(Story).filter(Story.status == StoryStatus.APPROVED)
    
    if language:
        query = query.filter(Story.language == language)
    if level:
        query = query.filter(Story.level == level)
    
    total = query.count()
    stories = query.order_by(Story.created_at.desc()).offset(offset).limit(limit).all()
    
    story_items = []
    for story in stories:
        story_items.append(StoryListItem(
            story_id=str(story.story_id),
            title=story.title,
            language=story.language,
            level=story.level.value,
            thumbnail_url=story.metadata.get("thumbnail_url") if story.metadata else None,
            author={"name": story.author.name if story.author else "Unknown"},
            rating=story.metadata.get("rating", 0.0) if story.metadata else 0.0,
            completion_count=story.metadata.get("completion_count", 0) if story.metadata else 0
        ))
    
    return StoryListResponse(
        stories=story_items,
        total=total,
        limit=limit,
        offset=offset
    )

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(
    story_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get full story content"""
    story = db.query(Story).filter(Story.story_id == story_id).first()
    
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    
    # Format scenes
    scenes_data = []
    for scene in sorted(story.scenes, key=lambda x: x.scene_order):
        scenes_data.append({
            "id": str(scene.scene_id),
            "order": scene.scene_order,
            "text": scene.text,
            "text_translation": scene.text_translation,
            "image_url": scene.image_url,
            "audio_url": scene.audio_url,
            "choices": scene.choices_json or [],
            "interaction_type": scene.interaction_type.value
        })
    
    return StoryResponse(
        story_id=str(story.story_id),
        language=story.language,
        dialect=story.dialect,
        title=story.title,
        title_translation=story.title_translation,
        level=story.level.value,
        author={
            "user_id": str(story.author.user_id) if story.author else None,
            "name": story.author.name if story.author else "Unknown"
        },
        metadata=story.metadata or {},
        scenes=scenes_data,
        created_at=story.created_at,
        updated_at=story.updated_at
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_story(
    story_data: StoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("contributor", "admin"))
):
    """Create a new story (requires contributor or admin role)"""
    # Create story
    new_story = Story(
        title=story_data.title,
        title_translation=story_data.title_translation,
        language=story_data.language,
        dialect=story_data.dialect,
        level=story_data.level,
        author_id=current_user.user_id,
        status=StoryStatus.PENDING,
        metadata=story_data.metadata or {}
    )
    
    db.add(new_story)
    db.flush()  # Get story_id
    
    # Create scenes
    for idx, scene_data in enumerate(story_data.scenes):
        new_scene = StoryScene(
            story_id=new_story.story_id,
            scene_order=idx + 1,
            text=scene_data.get("text", ""),
            text_translation=scene_data.get("text_translation"),
            image_url=scene_data.get("image_url"),
            audio_url=scene_data.get("audio_url"),
            choices_json=scene_data.get("choices", []),
            interaction_type=scene_data.get("interaction_type", "continue")
        )
        db.add(new_scene)
    
    db.commit()
    db.refresh(new_story)
    
    return {"story_id": str(new_story.story_id), "message": "Story submitted for review"}
```

### Phase 5: Voice Processing Integration (1 hour)

#### 5.1 ML Service Client
**File**: `app/services/ml_service.py`
```python
import httpx
import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:5000")

async def transcribe_audio(audio_bytes: bytes, language_code: str) -> Dict[str, Any]:
    """Call ML service to transcribe audio"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            files = {"file": ("audio.wav", audio_bytes, "audio/wav")}
            data = {"language_code": language_code}
            response = await client.post(
                f"{ML_SERVICE_URL}/transcribe",
                files=files,
                data=data
            )
            response.raise_for_status()
            return response.json()
    except httpx.RequestError as e:
        raise Exception(f"ML service unavailable: {str(e)}")
    except httpx.HTTPStatusError as e:
        raise Exception(f"ML service error: {e.response.text}")

async def get_recommendations(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Call ML service to get story recommendations"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{ML_SERVICE_URL}/recommend",
                json=user_data
            )
            response.raise_for_status()
            return response.json()
    except httpx.RequestError:
        # Return empty recommendations if ML service is down
        return {"recommendations": []}
```

#### 5.2 Voice Routes
**File**: `app/routes/voice.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.ml_service import transcribe_audio

router = APIRouter(prefix="", tags=["voice"])

@router.post("/voice-to-text")
async def transcribe_voice(
    file: UploadFile = File(...),
    language_code: str = Form("en"),
    current_user: User = Depends(get_current_user)
):
    """Transcribe audio file to text"""
    # Validate file
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an audio file"
        )
    
    # Read file
    audio_bytes = await file.read()
    
    # Validate size (max 2MB)
    if len(audio_bytes) > 2 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file too large (max 2MB)"
        )
    
    try:
        # Call ML service
        result = await transcribe_audio(audio_bytes, language_code)
        
        return {
            "transcription": result.get("transcription", ""),
            "confidence": result.get("confidence", 0.0),
            "language_detected": result.get("language_detected", language_code)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed: {str(e)}"
        )
```

### Phase 6: Main Application (30 minutes)

#### 6.1 Main App
**File**: `app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.database import init_db
from app.routes import auth, stories, voice

load_dotenv()

app = FastAPI(
    title="Indigenous Language Platform API",
    description="Backend API for AI-Powered Indigenous Language Platform",
    version="1.0.0"
)

# CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(stories.router, prefix="/api")
app.include_router(voice.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("Database initialized")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend-api"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3001))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

#### 6.2 Routes Init
**File**: `app/routes/__init__.py`
```python
# Empty file - makes routes a package
```

### Phase 7: Testing & Seed Data (1 hour)

#### 7.1 Seed Script
**File**: `scripts/seed.py`
```python
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.story import Story, StoryStatus, StoryLevel
from app.models.story_scene import StoryScene, InteractionType
from app.utils.security import get_password_hash

def seed():
    db = SessionLocal()
    try:
        init_db()
        
        # Create admin user
        admin_password = get_password_hash("admin123")
        admin = User(
            email="admin@example.com",
            password_hash=admin_password,
            name="Admin User",
            preferred_language="cr",
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.flush()
        
        # Create sample story
        story = Story(
            title="The Morning Song",
            language="cr",
            level=StoryLevel.BEGINNER,
            author_id=admin.user_id,
            status=StoryStatus.APPROVED,
            metadata={
                "age_range": "5-10",
                "themes": ["nature", "animals"],
                "vocabulary_count": 25
            }
        )
        db.add(story)
        db.flush()
        
        # Create scene
        scene = StoryScene(
            story_id=story.story_id,
            scene_order=1,
            text="Tānisi! My name is Miyo.",
            text_translation="Hello! My name is Miyo.",
            choices_json=[
                {
                    "id": "choice1",
                    "text": "Hello!",
                    "next_scene": "scene2a"
                }
            ],
            interaction_type=InteractionType.CHOICE
        )
        db.add(scene)
        
        db.commit()
        print("Seed data created successfully")
    except Exception as e:
        print(f"Seed error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
```

#### 7.2 Run Script
**File**: `run.py` (in backend root)
```python
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
```

## Testing Checklist

- [ ] Database connection works
- [ ] User registration creates account
- [ ] User login returns JWT token
- [ ] Protected routes require authentication
- [ ] Story creation works
- [ ] Story listing with filters works
- [ ] Story retrieval returns full content
- [ ] Voice transcription forwards to ML service
- [ ] Error handling returns proper status codes
- [ ] Input validation works

## Deliverables

1. ✅ Working FastAPI REST API with all endpoints
2. ✅ Database models with SQLAlchemy
3. ✅ Authentication with JWT
4. ✅ Story CRUD operations
5. ✅ Integration with ML service
6. ✅ Error handling and validation
7. ✅ Seed data for testing

## Running the Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Initialize database
python -c "from app.database import init_db; init_db()"

# Seed database (optional)
python scripts/seed.py

# Run server
python run.py
# Or: uvicorn app.main:app --reload --port 3001
```

## Next Steps

1. Add user progress tracking endpoints
2. Implement comments/ratings
3. Add file upload for media
4. Set up cloud storage integration
4. Add rate limiting
5. Implement caching (Redis)
6. Add API documentation (auto-generated by FastAPI at `/docs`)
