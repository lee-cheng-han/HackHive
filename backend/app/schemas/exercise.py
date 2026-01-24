"""
Exercise schemas.
"""
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

from app.models.exercise import ExerciseType


class ExerciseOption(BaseModel):
    """Exercise option schema for multiple choice."""
    id: str
    text: str
    translation: Optional[str] = None
    is_correct: bool


class ExerciseBase(BaseModel):
    """Base exercise schema."""
    type: ExerciseType
    question: str
    question_translation: Optional[str] = None
    options: Optional[List[ExerciseOption]] = None
    correct_answer: Union[str, List[str]]  # Can be string or array
    explanation: Optional[str] = None
    audio_url: Optional[str] = None


class ExerciseCreate(ExerciseBase):
    """Exercise creation schema."""
    lesson_id: UUID
    order: int = 0
    points: int = 1


class ExerciseUpdate(BaseModel):
    """Exercise update schema."""
    type: Optional[ExerciseType] = None
    question: Optional[str] = None
    question_translation: Optional[str] = None
    options: Optional[List[ExerciseOption]] = None
    correct_answer: Optional[Union[str, List[str]]] = None
    explanation: Optional[str] = None
    audio_url: Optional[str] = None
    order: Optional[int] = None
    points: Optional[int] = None


class ExerciseResponse(ExerciseBase):
    """Exercise response schema."""
    id: UUID
    lesson_id: UUID
    order: int
    points: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ExerciseSubmission(BaseModel):
    """Exercise submission schema."""
    exercise_id: UUID
    answer: Union[str, List[str]]  # User's answer

