"""
Progress schemas.
"""
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class ProgressResponse(BaseModel):
    """User progress response schema."""
    user_id: UUID
    words_learned: int
    stories_completed: int
    day_streak: int
    current_level: Optional[str] = None
    statistics: Optional[Dict[str, Any]] = None
    last_activity: datetime
    
    class Config:
        from_attributes = True


class LessonProgressResponse(BaseModel):
    """Lesson progress response schema."""
    user_id: UUID
    lesson_id: UUID
    is_completed: bool
    progress_percentage: float
    exercise_scores: Optional[Dict[str, float]] = None
    quiz_score: Optional[float] = None
    attempts: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserStatsResponse(BaseModel):
    """User statistics response schema."""
    words_learned: int
    stories_completed: int
    day_streak: int
    current_level: Optional[str] = None
    courses_completed: int
    lessons_completed: int
    total_time_minutes: Optional[int] = None
    weekly_goal_progress: Optional[float] = None  # Percentage of weekly goal

