"""
Lesson schemas.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

from app.models.lesson import LessonType
from app.schemas.exercise import ExerciseResponse


class LessonBase(BaseModel):
    """Base lesson schema."""
    title: str
    description: Optional[str] = None
    type: LessonType
    content: Optional[Dict[str, Any]] = None  # JSON content


class LessonCreate(LessonBase):
    """Lesson creation schema."""
    course_id: UUID
    order: int
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None


class LessonUpdate(BaseModel):
    """Lesson update schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[LessonType] = None
    content: Optional[Dict[str, Any]] = None
    order: Optional[int] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None


class LessonResponse(LessonBase):
    """Lesson response schema."""
    id: UUID
    course_id: UUID
    order: int
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    exercises: Optional[List[ExerciseResponse]] = None  # Include exercises if requested
    
    class Config:
        from_attributes = True

