"""
User schemas.
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from uuid import UUID

from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    preferred_language: Optional[str] = None
    dialect: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema."""
    password: str


class UserUpdate(BaseModel):
    """User update schema."""
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    preferred_language: Optional[str] = None
    dialect: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    cultural_name: Optional[str] = None
    clan_affiliation: Optional[str] = None
    enable_subtitles: Optional[bool] = None
    voice_input_enabled: Optional[bool] = None
    kids_mode: Optional[bool] = None
    font_size: Optional[str] = None
    high_contrast: Optional[bool] = None
    allow_data_collection: Optional[bool] = None
    profile_public: Optional[bool] = None


class UserResponse(UserBase):
    """User response schema."""
    id: UUID
    is_active: bool
    is_verified: bool
    role: UserRole
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    cultural_name: Optional[str] = None
    clan_affiliation: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserProfile(UserResponse):
    """Extended user profile schema."""
    enable_subtitles: bool
    voice_input_enabled: bool
    kids_mode: bool
    font_size: str
    high_contrast: bool
    allow_data_collection: bool
    profile_public: bool
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

