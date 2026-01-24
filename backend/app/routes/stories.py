"""
Story routes.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID

from app.database import get_db
from app.middleware.auth import get_optional_user
from app.models.story import Story, StoryLevel
from app.models.user import User
from app.schemas.story import StoryResponse

router = APIRouter()


@router.get("/stories", response_model=List[StoryResponse])
async def list_stories(
    language: Optional[str] = Query(None, description="Filter by language code"),
    level: Optional[StoryLevel] = Query(None, description="Filter by level"),
    featured: Optional[bool] = Query(None, description="Filter featured stories"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """List all published stories with optional filters."""
    query = db.query(Story).filter(Story.is_published == True)
    
    if language:
        query = query.filter(Story.language == language)
    
    if level:
        query = query.filter(Story.level == level)
    
    if featured is not None:
        query = query.filter(Story.is_featured == featured)
    
    stories = query.order_by(Story.created_at.desc()).all()
    return stories


@router.get("/stories/{story_id}", response_model=StoryResponse)
async def get_story(
    story_id: UUID,
    include_scenes: bool = Query(False, description="Include scenes in response"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Get story by ID."""
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    
    if not story.is_published:
        # Only allow access to unpublished stories if user is creator or admin
        if not current_user or (current_user.id != story.created_by and current_user.role != "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Story not available"
            )
    
    # Increment view count
    story.views_count += 1
    db.commit()
    
    return story

