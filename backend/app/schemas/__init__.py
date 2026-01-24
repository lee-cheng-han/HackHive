"""
Pydantic schemas for request/response validation.
"""
from app.schemas.auth import Token, TokenData, LoginRequest, RegisterRequest
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserProfile
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.schemas.lesson import LessonCreate, LessonUpdate, LessonResponse
from app.schemas.exercise import ExerciseCreate, ExerciseUpdate, ExerciseResponse, ExerciseSubmission
from app.schemas.progress import ProgressResponse, LessonProgressResponse, UserStatsResponse
from app.schemas.story import StoryCreate, StoryUpdate, StoryResponse, StorySceneResponse

__all__ = [
    # Auth
    "Token",
    "TokenData",
    "LoginRequest",
    "RegisterRequest",
    # User
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserProfile",
    # Course
    "CourseCreate",
    "CourseUpdate",
    "CourseResponse",
    # Lesson
    "LessonCreate",
    "LessonUpdate",
    "LessonResponse",
    # Exercise
    "ExerciseCreate",
    "ExerciseUpdate",
    "ExerciseResponse",
    "ExerciseSubmission",
    # Progress
    "ProgressResponse",
    "LessonProgressResponse",
    "UserStatsResponse",
    # Story
    "StoryCreate",
    "StoryUpdate",
    "StoryResponse",
    "StorySceneResponse",
]
