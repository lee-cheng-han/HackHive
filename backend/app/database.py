"""
Database configuration and session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Create database engine (lazy initialization)
_engine = None

def get_engine():
    """Get or create database engine."""
    global _engine
    if _engine is None:
        _engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,  # Verify connections before using
            pool_size=10,  # Connection pool size
            max_overflow=20,  # Max connections beyond pool_size
            echo=settings.DEBUG,  # Log SQL queries in debug mode
        )
    return _engine

# For backward compatibility
engine = property(lambda self: get_engine())

# Create session factory (lazy)
_SessionLocal = None

def get_session_local():
    """Get or create session factory."""
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _SessionLocal

SessionLocal = property(lambda self: get_session_local())

# Base class for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting database session.
    Yields a database session and ensures it's closed after use.
    """
    db = get_session_local()()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize database - create all tables.
    Should be called after all models are imported.
    """
    try:
        # Import all models here to ensure they're registered with Base
        from app.models import user, course, lesson, exercise, progress, story
        
        # Create all tables
        Base.metadata.create_all(bind=get_engine())
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise


def drop_db() -> None:
    """
    Drop all database tables.
    WARNING: This will delete all data!
    """
    try:
        Base.metadata.drop_all(bind=get_engine())
        logger.warning("All database tables dropped")
    except Exception as e:
        logger.error(f"Error dropping database: {e}")
        raise

