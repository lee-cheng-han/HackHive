"""
Course schemas.
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

from app.models.course import CourseLevel
from app.schemas.lesson import LessonResponse


class CourseBase(BaseModel):
    """Base course schema."""
    title: str
    description: Optional[str] = None
    language: str  # Language code: 'cr', 'oj', 'iu', 'moh'
    level: CourseLevel


class CourseCreate(CourseBase):
    """Course creation schema."""
    thumbnail_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None


class CourseUpdate(BaseModel):
    """Course update schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    level: Optional[CourseLevel] = None
    thumbnail_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class CourseResponse(CourseBase):
    """Course response schema."""
    id: UUID
    thumbnail_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None
    is_published: bool
    is_featured: bool
    created_at: datetime
    updated_at: datetime
    lessons: Optional[List[LessonResponse]] = None  # Include lessons if requested
    
    class Config:
        from_attributes = True

