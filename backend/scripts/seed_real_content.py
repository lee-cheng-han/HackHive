"""
Seed database with real Cree language course content.
Based on authentic Plains Cree (Nēhiyawēwin) language learning.
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
from app.utils.security import get_password_hash
import uuid


def create_cree_basics_course(db: Session, teacher_id):
    """Create comprehensive Plains Cree Basics course with real content."""
    print("Creating Plains Cree Basics course...")
    
    course = Course(
        id=uuid.uuid4(),
        title="ᓀᐦᐃᔭᐍᐏᐣ - Plains Cree Basics",
        description="Master the fundamentals of Plains Cree (Nēhiyawēwin) through interactive lessons. Learn greetings, numbers, family terms, and basic conversation.",
        language="cr",
        level=CourseLevel.BEGINNER,
        thumbnail_url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        estimated_time_minutes=180,
        is_published=True,
        is_featured=True,
        created_by=teacher_id,
        order_index=1,
    )
    
    db.add(course)
    db.commit()
    db.refresh(course)
    
    # Lesson 1: Greetings
    lesson1 = Lesson(
        id=uuid.uuid4(),
        course_id=course.id,
        title="Lesson 1: ᑖᓂᓯ - Greetings",
        description="Learn essential greetings and how to introduce yourself in Plains Cree",
        order=1,
        type=LessonType.CONVERSATION,
        content={
            "text": "In Plains Cree, greetings are an important part of daily interaction and show respect for others.",
            "vocabulary": [
                {
                    "word": "ᑖᓂᓯ",
                    "sro": "Tānisi",
                    "translation": "Hello / How are you?",
                    "pronunciation": "TAH-ni-si",
                    "example": "ᑖᓂᓯ, ᓂᑐᑌᒼ ᒫᕐᐃ",
                    "example_translation": "Hello, my name is Mary",
                    "cultural_note": "This is the most common greeting in Plains Cree, used any time of day."
                },
                {
                    "word": "ᓂᑕᓂᓯ",
                    "sro": "Nitānisi",
                    "translation": "I'm doing well",
                    "pronunciation": "ni-TAH-ni-si",
                    "example": "ᓂᑕᓂᓯ, ᑮᔭ ᒫᑲ?",
                    "example_translation": "I'm well, and you?"
                },
                {
                    "word": "ᐁᑯᓯ",
                    "sro": "Ēkosi",
                    "translation": "That's it / That's all / Goodbye",
                    "pronunciation": "AY-ko-si",
                    "cultural_note": "Used to conclude conversations or indicate completion."
                },
                {
                    "word": "ᑭᓇᓈᐢᑯᒥᑎᐣ",
                    "sro": "Kinanāskomitin",
                    "translation": "Thank you",
                    "pronunciation": "ki-nah-NAS-ko-mi-tin",
                    "example": "ᑭᓇᓈᐢᑯᒥᑎᐣ ᑭᔭ ᐅᒪ ᐸᐃᑯᓯᐏᐣ",
                    "example_translation": "Thank you for this teaching"
                },
            ],
            "grammar": [
                {
                    "title": "Personal Introductions",
                    "explanation": "To say your name in Cree, use: [Your name] nitisiyihkāson (that's what I'm called)",
                    "examples": [
                        {
                            "text": "ᒫᕐᐃ ᓂᑎᓯᔨᐦᑳᓱᐣ",
                            "translation": "My name is Mary (literally: 'Mary, that's what I'm called')"
                        }
                    ]
                }
            ],
            "examples": [
                {
                    "text": "ᑖᓂᓯ, ᑕᐣᒋ ᐅᐦᒋ?",
                    "translation": "Hello, where are you from?",
                    "context": "greeting"
                },
                {
                    "text": "ᓂᑕᓂᓯ, ᑭᔭ ᒫᑲ?",
                    "translation": "I'm well, and you?",
                    "context": "response"
                }
            ]
        },
        estimated_time_minutes=25,
    )
    
    db.add(lesson1)
    db.commit()
    db.refresh(lesson1)
    
    # Exercises for Lesson 1
    exercises_lesson1 = [
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson1.id,
            type=ExerciseType.MULTIPLE_CHOICE,
            question="What does 'ᑖᓂᓯ' (Tānisi) mean?",
            question_translation="Choose the correct translation",
            options=[
                {"id": "a", "text": "Hello / How are you?", "is_correct": True},
                {"id": "b", "text": "Goodbye", "is_correct": False},
                {"id": "c", "text": "Thank you", "is_correct": False},
                {"id": "d", "text": "My name is", "is_correct": False},
            ],
            correct_answer="a",
            explanation="Tānisi is the most common greeting in Plains Cree, meaning both 'Hello' and 'How are you?'",
            order=1,
            points=10,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson1.id,
            type=ExerciseType.TRANSLATION,
            question="Translate to English: ᑭᓇᓈᐢᑯᒥᑎᐣ",
            question_translation="What does this word mean?",
            options=None,
            correct_answer="Thank you",
            explanation="Kinanāskomitin means 'Thank you' in Plains Cree. It's used to express gratitude.",
            order=2,
            points=15,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson1.id,
            type=ExerciseType.FILL_BLANK,
            question="Complete the greeting: _____, ᓂᑐᑌᒼ ᒫᕐᐃ",
            question_translation="Fill in the blank with the Cree word for 'Hello'",
            options=None,
            correct_answer="Tānisi",
            explanation="The complete phrase is 'Tānisi, nitōtēm Mary' (Hello, my name is Mary)",
            order=3,
            points=10,
        ),
        # Note: Matching exercises need special handling - using multiple choice for now
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson1.id,
            type=ExerciseType.MULTIPLE_CHOICE,
            question="What does 'ᐁᑯᓯ' (Ēkosi) mean?",
            question_translation="Choose the correct translation",
            options=[
                {"id": "a", "text": "Hello", "is_correct": False},
                {"id": "b", "text": "That's all / Goodbye", "is_correct": True},
                {"id": "c", "text": "Thank you", "is_correct": False},
                {"id": "d", "text": "My name is", "is_correct": False},
            ],
            correct_answer="b",
            explanation="Ēkosi means 'That's all' or 'That's it', often used as a way to say goodbye or conclude.",
            order=4,
            points=15,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson1.id,
            type=ExerciseType.PRONUNCIATION,
            question="Practice pronunciation: Say 'ᑖᓂᓯ' (Tānisi)",
            question_translation="Record yourself saying this greeting",
            options=None,
            correct_answer="Tānisi",
            explanation="Focus on the three syllables: TAH-ni-si. The first syllable is stressed.",
            order=5,
            points=20,
        ),
    ]
    
    for exercise in exercises_lesson1:
        db.add(exercise)
    
    # Lesson 2: Numbers
    lesson2 = Lesson(
        id=uuid.uuid4(),
        course_id=course.id,
        title="Lesson 2: ᐊᔭᒥᓭᐏᓇ - Numbers 1-10",
        description="Learn to count from one to ten in Plains Cree",
        order=2,
        type=LessonType.VOCABULARY,
        content={
            "text": "Numbers are essential for daily communication. In Cree, numbers have both a counting form and a form used with nouns.",
            "vocabulary": [
                {"word": "ᐯᔭᐠ", "sro": "pēyak", "translation": "one", "pronunciation": "PAY-ak"},
                {"word": "ᓃᓱ", "sro": "nīso", "translation": "two", "pronunciation": "NEE-so"},
                {"word": "ᓂᔥᑐ", "sro": "nisto", "translation": "three", "pronunciation": "NIS-to"},
                {"word": "ᓀᐓ", "sro": "nēwo", "translation": "four", "pronunciation": "NAY-wo"},
                {"word": "ᓃᔮᓇᐣ", "sro": "nīyānan", "translation": "five", "pronunciation": "nee-YAH-nan"},
                {"word": "ᓂᑯᑦᐘᓯᐠ", "sro": "nikotwāsik", "translation": "six", "pronunciation": "ni-KOT-wah-sik"},
                {"word": "ᑌᐸᑯᐦᑊ", "sro": "tēpakohp", "translation": "seven", "pronunciation": "tay-PAH-kohp"},
                {"word": "ᐊᔭᓇᓀᐤ", "sro": "ayananēw", "translation": "eight", "pronunciation": "ah-yah-nah-NAY-w"},
                {"word": "ᑫᑳᒥᑕᑕᐦᑦ", "sro": "kēkāmitātaht", "translation": "nine", "pronunciation": "kay-KAH-mi-tah-taht"},
                {"word": "ᒣᑖᑕᐦᑦ", "sro": "mitātaht", "translation": "ten", "pronunciation": "mi-TAH-taht"},
            ],
            "examples": [
                {"text": "ᓂᔥᑐ ᐊᐧᓵᑲᓇ", "translation": "three deer"},
                {"text": "ᓀᐓ ᐊᐱᓯᓯᓴ", "translation": "four horses"},
            ]
        },
        estimated_time_minutes=20,
    )
    
    db.add(lesson2)
    db.commit()
    db.refresh(lesson2)
    
    # Exercises for Lesson 2
    exercises_lesson2 = [
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson2.id,
            type=ExerciseType.MULTIPLE_CHOICE,
            question="What number is 'ᓃᓱ' (nīso)?",
            options=[
                {"id": "a", "text": "One", "is_correct": False},
                {"id": "b", "text": "Two", "is_correct": True},
                {"id": "c", "text": "Three", "is_correct": False},
                {"id": "d", "text": "Four", "is_correct": False},
            ],
            correct_answer="b",
            explanation="nīso (ᓃᓱ) means 'two' in Plains Cree.",
            order=1,
            points=10,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson2.id,
            type=ExerciseType.LISTENING,
            question="Listen and select the correct number",
            question_translation="You will hear a Cree number. Select what you hear.",
            options=[
                {"id": "a", "text": "pēyak (1)", "is_correct": False},
                {"id": "b", "text": "nisto (3)", "is_correct": False},
                {"id": "c", "text": "nīyānan (5)", "is_correct": True},
                {"id": "d", "text": "nēwo (4)", "is_correct": False},
            ],
            correct_answer="c",
            explanation="The audio said 'nīyānan' which means 'five'.",
            audio_url="https://example.com/audio/niyanan.mp3",  # Placeholder
            order=2,
            points=15,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson2.id,
            type=ExerciseType.PRONUNCIATION,
            question="Say the number: ᓀᐓ (nēwo)",
            question_translation="Practice saying 'four' in Cree",
            correct_answer="nēwo",
            explanation="Remember: NAY-wo. The 'ē' is a long vowel sound like 'ay' in 'day'.",
            order=3,
            points=20,
        ),
    ]
    
    for exercise in exercises_lesson2:
        db.add(exercise)
    
    # Lesson 3: Family Terms
    lesson3 = Lesson(
        id=uuid.uuid4(),
        course_id=course.id,
        title="Lesson 3: ᓂᐚᐦᑰᒪᑲᓇᐠ - My Family",
        description="Learn words for family members and relationships",
        order=3,
        type=LessonType.VOCABULARY,
        content={
            "text": "Family is central to Cree culture. These terms reflect the importance of kinship and community relationships.",
            "vocabulary": [
                {"word": "ᓂᑳᐏᕀ", "sro": "nikāwīy", "translation": "my mother", "pronunciation": "ni-KAH-weey"},
                {"word": "ᓄᐦᑕᐏᕀ", "sro": "nohtāwīy", "translation": "my father", "pronunciation": "noh-TAH-weey"},
                {"word": "ᓂᒥᐢ", "sro": "nimis", "translation": "my older sister", "pronunciation": "NI-mis"},
                {"word": "ᓂᐢᑌᐢ", "sro": "nistēs", "translation": "my older brother", "pronunciation": "NIS-tays"},
                {"word": "ᓂᓰᒻ", "sro": "nisīm", "translation": "my younger sibling", "pronunciation": "ni-SEEM"},
                {"word": "ᓂᒧᐦᑐᒼ", "sro": "nimohtom", "translation": "my grandmother", "pronunciation": "ni-MOH-tom"},
                {"word": "ᓂᒧᔑᒻ", "sro": "nimoshom", "translation": "my grandfather", "pronunciation": "ni-MO-shom"},
            ],
            "cultural_context": "In Cree culture, family extends beyond blood relations. The concept of 'all my relations' (ᐅᒪ ᓂᐚᐦᑰᒪᑲᓇᐠ) includes community members, ancestors, and even nature.",
            "examples": [
                {"text": "ᓂᑳᐏᕀ ᑭᔅᑮᐏᓂᐤ", "translation": "My mother is a teacher"},
                {"text": "ᓂᒧᔑᒻ ᐋᒋᒧᓰᔨᐤ", "translation": "My grandfather tells stories"},
            ]
        },
        estimated_time_minutes=30,
    )
    
    db.add(lesson3)
    db.commit()
    db.refresh(lesson3)
    
    # Exercises for Lesson 3
    exercises_lesson3 = [
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson3.id,
            type=ExerciseType.MULTIPLE_CHOICE,
            question="How do you say 'my mother' in Cree?",
            options=[
                {"id": "a", "text": "nikāwīy", "is_correct": True},
                {"id": "b", "text": "nohtāwīy", "is_correct": False},
                {"id": "c", "text": "nimis", "is_correct": False},
                {"id": "d", "text": "nimoshom", "is_correct": False},
            ],
            correct_answer="a",
            explanation="nikāwīy (ᓂᑳᐏᕀ) means 'my mother' in Plains Cree.",
            order=1,
            points=10,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson3.id,
            type=ExerciseType.FILL_BLANK,
            question="My grandfather = ni_____",
            question_translation="Complete the word for 'my grandfather'",
            correct_answer="moshom",
            explanation="nimoshom (ᓂᒧᔑᒻ) - 'my grandfather'. Elders are highly respected in Cree culture.",
            order=2,
            points=15,
        ),
        Exercise(
            id=uuid.uuid4(),
            lesson_id=lesson3.id,
            type=ExerciseType.PRONUNCIATION,
            question="Say: ᓂᑳᐏᕀ (nikāwīy)",
            question_translation="Practice saying 'my mother'",
            correct_answer="nikāwīy",
            explanation="Pronunciation: ni-KAH-weey. The 'ī' is a long 'ee' sound.",
            order=3,
            points=20,
        ),
    ]
    
    for exercise in exercises_lesson3:
        db.add(exercise)
    
    db.commit()
    print(f"✅ Created course with 3 lessons and {len(exercises_lesson1) + len(exercises_lesson2) + len(exercises_lesson3)} exercises")
    
    return course


def main():
    """Seed real course content."""
    print("\n🌱 Seeding Real Plains Cree Course Content...\n")
    
    init_db()
    db = get_session_local()()
    
    try:
        # Get or create teacher
        teacher = db.query(User).filter(User.email == "teacher@turtletalk.app").first()
        if not teacher:
            teacher = User(
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
            )
            db.add(teacher)
            db.commit()
            db.refresh(teacher)
        
        # Create course
        course = create_cree_basics_course(db, teacher.id)
        
        print(f"\n✅ Real course content seeded successfully!")
        print(f"   Course ID: {course.id}")
        print(f"   Access at: http://localhost:3000")
        print(f"   API: http://localhost:3001/api/v1/courses/{course.id}")
        
    except Exception as e:
        print(f"\n❌ Error seeding content: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

