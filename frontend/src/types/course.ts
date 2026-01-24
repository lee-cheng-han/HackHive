// Course and lesson type definitions

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string; // Language code: 'cr', 'oj', 'iu', 'moh'
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  lessons: Lesson[];
  progress?: number; // 0-100
  completed?: boolean;
  estimatedTime?: number; // minutes
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number; // Order within course
  type: 'vocabulary' | 'grammar' | 'conversation' | 'pronunciation' | 'story';
  content: LessonContent;
  exercises: Exercise[];
  audioUrl?: string;
  imageUrl?: string;
  completed?: boolean;
  progress?: number; // 0-100
  estimatedTime?: number; // minutes
}

export interface LessonContent {
  text: string; // Main lesson text in target language
  translation?: string; // English translation
  vocabulary?: VocabularyItem[]; // Key words/phrases
  grammar?: GrammarPoint[]; // Grammar explanations
  examples?: Example[]; // Usage examples
}

export interface VocabularyItem {
  word: string; // Word in target language
  translation: string; // English translation
  pronunciation?: string; // Phonetic/spelling guide
  audioUrl?: string; // Audio pronunciation
  example?: string; // Example sentence
  exampleTranslation?: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string; // English explanation
  examples: Example[];
}

export interface Example {
  text: string; // In target language
  translation: string; // English
  audioUrl?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'pronunciation' | 'translation' | 'listening';
  question: string; // Question text
  questionTranslation?: string;
  options?: ExerciseOption[]; // For multiple choice
  correctAnswer: string | string[]; // Answer(s)
  explanation?: string; // Explanation after answering
  audioUrl?: string; // For listening exercises
  points?: number; // XP points for this exercise
  attempts?: number; // User's attempts
  completed?: boolean;
  score?: number; // 0-100
}

export interface ExerciseOption {
  id: string;
  text: string;
  translation?: string;
  isCorrect: boolean;
}

export interface PronunciationFeedback {
  score: number; // 0-100
  accuracy: number; // Phoneme accuracy
  feedback: string; // Text feedback
  issues?: PronunciationIssue[]; // Specific problems
  audioComparison?: {
    userAudio: string; // URL to user's recording
    referenceAudio: string; // URL to reference
  };
}

export interface PronunciationIssue {
  phoneme: string;
  position: number; // Position in word/phrase
  issue: string; // Description of the problem
  suggestion: string; // How to fix it
}

