"""
Course routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.middleware.auth import get_optional_user
from app.models.course import Course, CourseLevel
from app.models.user import User
from app.schemas.course import CourseResponse, CourseCreate, CourseUpdate

router = APIRouter()


@router.get("/courses", response_model=List[CourseResponse])
async def list_courses(
    language: Optional[str] = Query(None, description="Filter by language code"),
    level: Optional[CourseLevel] = Query(None, description="Filter by level"),
    featured: Optional[bool] = Query(None, description="Filter featured courses"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """List all published courses with optional filters."""
    query = db.query(Course).filter(Course.is_published == True)
    
    if language:
        query = query.filter(Course.language == language)
    
    if level:
        query = query.filter(Course.level == level)
    
    if featured is not None:
        query = query.filter(Course.is_featured == featured)
    
    courses = query.order_by(Course.order_index, Course.created_at).all()
    return courses


@router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: UUID,
    include_lessons: bool = Query(False, description="Include lessons in response"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Get course by ID."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    if not course.is_published:
        # Only allow access to unpublished courses if user is creator or admin
        if not current_user or (current_user.id != course.created_by and current_user.role != "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Course not available"
            )
    
    return course

