"""
Seed database with sample data for testing.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy.orm import Session
from app.database import get_session_local, init_db
from app.models.user import User, UserRole
from app.models.course import Course, CourseLevel
from app.models.lesson import Lesson, LessonType
from app.models.exercise import Exercise, ExerciseType
from app.models.story import Story, StoryLevel, StoryScene
from app.models.progress import UserProgress
from app.utils.security import get_password_hash
import uuid


def seed_users(db: Session):
    """Create sample users."""
    print("Seeding users...")
    
    users = [
        User(
            id=uuid.uuid4(),
            email="admin@turtletalk.app",
            hashed_password=get_password_hash("admin123"),
            username="admin",
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
            preferred_language="en",
        ),
        User(
            id=uuid.uuid4(),
            email="learner@turtletalk.app",
            hashed_password=get_password_hash("learner123"),
            username="cree_learner",
            first_name="Sarah",
            last_name="Johnson",
            role=UserRole.LEARNER,
            is_active=True,
            is_verified=True,
            preferred_language="cr",
            enable_subtitles=True,
            voice_input_enabled=True,
        ),
        User(
            id=uuid.uuid4(),
            email="teacher@turtletalk.app",
            hashed_password=get_password_hash("teacher123"),
            username="cree_teacher",
            first_name="Elder",
            last_name="Whitebear",
            role=UserRole.TEACHER,
            is_active=True,
            is_verified=True,
            preferred_language="cr",
            cultural_name="Wāpamōhkāsow",
        ),
    ]
    
    for user in users:
        existing = db.query(User).filter(User.email == user.email).first()
        if not existing:
            db.add(user)
    
    db.commit()
    print(f"✅ Created {len(users)} users")
    return users


def seed_courses(db: Session, teacher_id):
    """Create sample courses with lessons."""
    print("Seeding courses...")
    
    # Cree Basics Course
    cree_course = Course(
        id=uuid.uuid4(),
        title="Plains Cree Basics",
        description="Learn fundamental greetings, introductions, and common phrases in Plains Cree (Nēhiyawēwin).",
        language="cr",
        level=CourseLevel.BEGINNER,
        thumbnail_url="https://via.placeholder.com/300x200?text=Cree+Basics",
        estimated_time_minutes=120,
        is_published=True,
        is_featured=True,
        created_by=teacher_id,
    )
    
    # Ojibwe Family Course
    ojibwe_course = Course(
        id=uuid.uuid4(),
        title="Ojibwe Family Terms",
        description="Master vocabulary for family members and relationships in Anishinaabemowin.",
        language="oj",
        level=CourseLevel.BEGINNER,
        thumbnail_url="https://via.placeholder.com/300x200?text=Ojibwe+Family",
        estimated_time_minutes=90,
        is_published=True,
        created_by=teacher_id,
    )
    
    db.add(cree_course)
    db.add(ojibwe_course)
    db.commit()
    
    print(f"✅ Created 2 courses")
    
    # Add lessons to Cree course
    seed_cree_lessons(db, cree_course.id)
    
    return [cree_course, ojibwe_course]


def seed_cree_lessons(db: Session, course_id):
    """Create sample lessons for Cree course."""
    print("Seeding lessons...")
    
    lessons = [
        Lesson(
            id=uuid.uuid4(),
            course_id=course_id,
            title="Greetings and Introductions",
            description="Learn how to greet people and introduce yourself",
            order=1,
            type=LessonType.CONVERSATION,
            content={
                "text": "Tānisi! Niwāhkōmākanak. Tānitē nitōtēm?",
                "translation": "Hello! My friends. How are you?",
                "vocabulary": [
                    {
                        "word": "Tānisi",
                        "translation": "Hello",
                        "pronunciation": "TAH-ni-si",
                    },
                    {
                        "word": "Niwāhkōmākanak",
                        "translation": "My friends",
                        "pronunciation": "ni-WAH-ko-MA-ka-nak",
                    },
                    {
                        "word": "Tānitē",
                        "translation": "How",
                        "pronunciation": "TAH-ni-tay",
                    },
                ],
                "examples": [
                    {
                        "text": "Tānisi, nitōtēm Wāpamōhkāsow",
                        "translation": "Hello, my name is White Bear",
                    }
                ]
            },
            estimated_time_minutes=20,
        ),
        Lesson(
            id=uuid.uuid4(),
            course_id=course_id,
            title="Numbers 1-10",
            description="Learn to count from 1 to 10 in Plains Cree",
            order=2,
            type=LessonType.VOCABULARY,
            content={
                "text": "Learn the numbers 1-10",
                "vocabulary": [
                    {"word": "pēyak", "translation": "one", "pronunciation": "PAY-ak"},
                    {"word": "nīso", "translation": "two", "pronunciation": "NEE-so"},
                    {"word": "nisto", "translation": "three", "pronunciation": "NIS-to"},
                    {"word": "nēwo", "translation": "four", "pronunciation": "NAY-wo"},
                    {"word": "nīyānan", "translation": "five", "pronunciation": "nee-YAH-nan"},
                ]
            },
            estimated_time_minutes=15,
        ),
        Lesson(
            id=uuid.uuid4(),
            course_id=course_id,
            title="Pronunciation Practice",
            description="Practice pronouncing common Cree sounds",
            order=3,
            type=LessonType.PRONUNCIATION,
            content={
                "text": "Practice these important sounds in Cree",
                "vocabulary": [
                    {"word": "ē", "translation": "long 'ay' sound", "pronunciation": "ay"},
                    {"word": "ī", "translation": "long 'ee' sound", "pronunciation": "ee"},
                    {"word": "ō", "translation": "long 'oh' sound", "pronunciation": "oh"},
                ]
            },
            estimated_time_minutes=25,
        ),
    ]
    
    for lesson in lessons:
        db.add(lesson)
    
    db.commit()
    print(f"✅ Created {len(lessons)} lessons")
    
    # Add exercises to first lesson
    seed_exercises(db, lessons[0].id)


def seed_exercises(db: Session, lesson_id):
    """Create sample exercises."""
    print("Seeding exercises...")
    
    exercises = [
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson_id,
            type=ExerciseType.MULTIPLE_CHOICE,
            question="How do you say 'Hello' in Cree?",
            question_translation="Choose the correct greeting",
            options=[
                {"id": "a", "text": "Tānisi", "translation": "Hello", "is_correct": True},
                {"id": "b", "text": "Kinanāskomitin", "translation": "Thank you", "is_correct": False},
                {"id": "c", "text": "Namōya", "translation": "No", "is_correct": False},
            ],
            correct_answer="a",
            explanation="'Tānisi' is the most common greeting in Plains Cree, similar to 'hello' in English.",
            order=1,
            points=10,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson_id,
            type=ExerciseType.TRANSLATION,
            question="Tānitē nitōtēm?",
            question_translation="Translate this phrase to English",
            options=None,
            correct_answer="How are you?",
            explanation="'Tānitē nitōtēm?' literally means 'How are you?'",
            order=2,
            points=15,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson_id,
            type=ExerciseType.FILL_BLANK,
            question="Complete: _____, Niwāhkōmākanak!",
            question_translation="Fill in the greeting",
            options=None,
            correct_answer="Tānisi",
            explanation="The complete greeting is 'Tānisi, Niwāhkōmākanak!' (Hello, my friends!)",
            order=3,
            points=10,
        ),
    ]
    
    for exercise in exercises:
        db.add(exercise)
    
    db.commit()
    print(f"✅ Created {len(exercises)} exercises")


def seed_stories(db: Session, teacher_id):
    """Create sample stories."""
    print("Seeding stories...")
    
    story = Story(
        id=uuid.uuid4(),
        title="The Teachings of the Turtle",
        description="A traditional Cree story about wisdom and patience",
        language="cr",
        level=StoryLevel.BEGINNER,
        text="The turtle teaches us to be patient and persistent. Slow and steady wins the race.",
        text_translation="The turtle teaches us to be patient and persistent. Slow and steady wins the race.",
        thumbnail_url="https://via.placeholder.com/400x300?text=Turtle+Story",
        estimated_time_minutes=5,
        word_count=150,
        is_published=True,
        is_featured=True,
        created_by=teacher_id,
        likes_count=45,
        views_count=120,
    )
    
    db.add(story)
    db.commit()
    
    # Add story scenes
    scenes = [
        StoryScene(
            id=uuid.uuid4(),
            story_id=story.id,
            order=1,
            text="Kīsikāw, ōmisi miskīk pēyak mīkisowiyiniw",
            text_translation="One day, a turtle was found by the river",
        ),
        StoryScene(
            id=uuid.uuid4(),
            story_id=story.id,
            order=2,
            text="Kiskinohamākēw ayisiyiniwa kīskinohamātowinihk",
            text_translation="The turtle taught the people about patience",
        ),
    ]
    
    for scene in scenes:
        db.add(scene)
    
    db.commit()
    print(f"✅ Created 1 story with {len(scenes)} scenes")


def seed_progress(db: Session, user_id, course_id):
    """Create sample progress data."""
    print("Seeding progress data...")
    
    progress = UserProgress(
        id=uuid.uuid4(),
        user_id=user_id,
        course_id=course_id,
        words_learned=42,
        stories_completed=3,
        day_streak=7,
        current_level="beginner",
        statistics={
            "time_spent_minutes": 120,
            "quizzes_taken": 8,
            "average_score": 85,
        },
    )
    
    db.add(progress)
    db.commit()
    print("✅ Created progress data")


def main():
    """Run all seed functions."""
    print("\n🌱 Seeding TurtleTalk Database...\n")
    
    # Initialize database
    init_db()
    
    # Create session
    db = get_session_local()()
    
    try:
        # Seed data
        users = seed_users(db)
        teacher = next(u for u in users if u.role == UserRole.TEACHER)
        learner = next(u for u in users if u.role == UserRole.LEARNER)
        
        courses = seed_courses(db, teacher.id)
        seed_stories(db, teacher.id)
        seed_progress(db, learner.id, courses[0].id)
        
        print("\n✅ Database seeded successfully!\n")
        print("Test credentials:")
        print("  Email: learner@turtletalk.app")
        print("  Password: learner123")
        print("\nOr:")
        print("  Email: teacher@turtletalk.app")
        print("  Password: teacher123")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

