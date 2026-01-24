"""
Progress tracking routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.progress import UserProgress, LessonProgress
from app.models.lesson import Lesson
from app.schemas.progress import ProgressResponse, LessonProgressResponse, UserStatsResponse
from pydantic import BaseModel

router = APIRouter()


class LessonStartRequest(BaseModel):
    """Request to start a lesson."""
    lesson_id: UUID


class ExerciseSubmissionRequest(BaseModel):
    """Request to submit exercise answer."""
    exercise_id: UUID
    answer: str | list[str]


class LessonCompleteRequest(BaseModel):
    """Request to complete a lesson."""
    lesson_id: UUID
    exercise_scores: dict[str, float]
    quiz_score: Optional[float] = None


@router.get("/progress/stats", response_model=UserStatsResponse)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's overall learning statistics."""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).first()
    
    if not progress:
        # Create initial progress
        progress = UserProgress(
            user_id=current_user.id,
            words_learned=0,
            stories_completed=0,
            day_streak=0,
            current_level="beginner",
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    # Count completed lessons
    completed_lessons = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.is_completed == True
    ).count()
    
    # Calculate weekly goal progress (mock for now)
    weekly_goal_progress = min(100, (progress.day_streak / 7) * 100)
    
    return {
        "words_learned": progress.words_learned,
        "stories_completed": progress.stories_completed,
        "day_streak": progress.day_streak,
        "current_level": progress.current_level,
        "courses_completed": 0,  # TODO: Calculate from course progress
        "lessons_completed": completed_lessons,
        "total_time_minutes": progress.statistics.get("time_spent_minutes", 0) if progress.statistics else 0,
        "weekly_goal_progress": weekly_goal_progress,
    }


@router.post("/progress/lesson/start")
async def start_lesson(
    request: LessonStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a lesson (or resume if already started)."""
    # Check if lesson exists
    lesson = db.query(Lesson).filter(Lesson.id == request.lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Check if progress exists
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == request.lesson_id
    ).first()
    
    if not progress:
        # Create new progress
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=request.lesson_id,
            is_completed=False,
            progress_percentage=0.0,
            attempts=1,
        )
        db.add(progress)
    else:
        # Increment attempts
        progress.attempts += 1
        progress.last_attempt_at = datetime.utcnow()
    
    db.commit()
    db.refresh(progress)
    
    return {
        "lesson_id": str(request.lesson_id),
        "progress_id": str(progress.id),
        "progress_percentage": progress.progress_percentage,
        "is_completed": progress.is_completed,
        "attempts": progress.attempts,
    }


@router.post("/progress/lesson/complete")
async def complete_lesson(
    request: LessonCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a lesson as complete and update progress."""
    # Get or create progress
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == request.lesson_id
    ).first()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=request.lesson_id,
        )
        db.add(progress)
    
    # Update progress
    progress.is_completed = True
    progress.progress_percentage = 100.0
    progress.exercise_scores = request.exercise_scores
    progress.quiz_score = request.quiz_score
    progress.completed_at = datetime.utcnow()
    
    # Update user's overall progress
    user_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).first()
    
    if not user_progress:
        user_progress = UserProgress(
            user_id=current_user.id,
            words_learned=0,
            stories_completed=0,
            day_streak=0,
        )
        db.add(user_progress)
    
    # Increment words learned based on lesson content
    lesson = db.query(Lesson).filter(Lesson.id == request.lesson_id).first()
    if lesson and lesson.content and isinstance(lesson.content, dict):
        vocabulary = lesson.content.get('vocabulary', [])
        user_progress.words_learned += len(vocabulary)
    
    # Update streak (simplified logic)
    user_progress.last_activity = datetime.utcnow()
    
    db.commit()
    db.refresh(progress)
    
    return {
        "lesson_id": str(request.lesson_id),
        "is_completed": True,
        "quiz_score": request.quiz_score,
        "words_learned": len(request.exercise_scores),
        "xp_earned": len(request.exercise_scores) * 10,  # 10 XP per exercise
    }


@router.post("/progress/exercise/submit")
async def submit_exercise(
    request: ExerciseSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit an exercise answer and get immediate feedback."""
    from app.models.exercise import Exercise
    
    # Get exercise
    exercise = db.query(Exercise).filter(Exercise.id == request.exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    # Check answer
    correct_answer = exercise.correct_answer
    user_answer = request.answer
    
    # Calculate score
    is_correct = False
    score = 0.0
    
    if isinstance(correct_answer, list):
        # Multiple correct answers
        if isinstance(user_answer, list):
            correct_count = sum(1 for ans in user_answer if ans in correct_answer)
            score = (correct_count / len(correct_answer)) * 100
            is_correct = score >= 70
        else:
            is_correct = user_answer in correct_answer
            score = 100.0 if is_correct else 0.0
    else:
        # Single correct answer
        if isinstance(user_answer, list):
            is_correct = correct_answer in user_answer
        else:
            is_correct = str(user_answer).strip().lower() == str(correct_answer).strip().lower()
        score = 100.0 if is_correct else 0.0
    
    # Award XP
    xp_earned = exercise.points if is_correct else 0
    
    return {
        "exercise_id": str(request.exercise_id),
        "is_correct": is_correct,
        "score": score,
        "xp_earned": xp_earned,
        "correct_answer": correct_answer,
        "explanation": exercise.explanation,
        "points": exercise.points,
    }


@router.get("/progress/lesson/{lesson_id}", response_model=LessonProgressResponse)
async def get_lesson_progress(
    lesson_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's progress for a specific lesson."""
    progress = db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id,
        LessonProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        # Return default progress
        return {
            "user_id": current_user.id,
            "lesson_id": lesson_id,
            "is_completed": False,
            "progress_percentage": 0.0,
            "exercise_scores": {},
            "quiz_score": None,
            "attempts": 0,
            "started_at": datetime.utcnow(),
            "completed_at": None,
        }
    
    return progress

