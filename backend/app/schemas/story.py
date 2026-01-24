"""
Story schemas.
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

from app.models.story import StoryLevel


class StoryBase(BaseModel):
    """Base story schema."""
    title: str
    description: Optional[str] = None
    language: str  # Language code
    level: StoryLevel
    text: Optional[str] = None
    text_translation: Optional[str] = None


class StoryCreate(StoryBase):
    """Story creation schema."""
    thumbnail_url: Optional[str] = None
    audio_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None
    is_community_contributed: bool = False


class StoryUpdate(BaseModel):
    """Story update schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    level: Optional[StoryLevel] = None
    text: Optional[str] = None
    text_translation: Optional[str] = None
    thumbnail_url: Optional[str] = None
    audio_url: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class StorySceneResponse(BaseModel):
    """Story scene response schema."""
    id: UUID
    story_id: UUID
    order: int
    text: str
    text_translation: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    choices: Optional[str] = None  # JSON string
    
    class Config:
        from_attributes = True


class StoryResponse(StoryBase):
    """Story response schema."""
    id: UUID
    thumbnail_url: Optional[str] = None
    audio_url: Optional[str] = None
    estimated_time_minutes: Optional[int] = None
    word_count: Optional[int] = None
    is_published: bool
    is_featured: bool
    is_community_contributed: bool
    likes_count: int
    views_count: int
    created_at: datetime
    updated_at: datetime
    scenes: Optional[List[StorySceneResponse]] = None  # Include scenes if requested
    
    class Config:
        from_attributes = True

