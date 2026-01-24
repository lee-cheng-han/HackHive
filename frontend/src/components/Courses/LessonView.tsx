import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  PlayArrow,
  VolumeUp,
  CheckCircle,
  School,
} from '@mui/icons-material';
import { Lesson, VocabularyItem, GrammarPoint, Example } from '../../types/course';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { TranslationDisplay } from '../Language/TranslationDisplay';
import { AudioPlayer } from '../Audio/AudioPlayer';
import { QuizComponent } from './QuizComponent';
import { PronunciationCoach } from './PronunciationCoach';
import { InteractiveLessonFlow } from './InteractiveLessonFlow';
import { LessonComplete } from './LessonComplete';

interface LessonViewProps {
  lesson: Lesson;
  courseTitle: string;
  onComplete: (lessonId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

type LessonStep = 'content' | 'vocabulary' | 'grammar' | 'practice' | 'quiz';

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  courseTitle,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState<LessonStep>('content');
  const [completedSteps, setCompletedSteps] = useState<Set<LessonStep>>(new Set());
  const [exerciseScores, setExerciseScores] = useState<Record<string, number>>({});
  const [showInteractiveFlow, setShowInteractiveFlow] = useState(false);
  const [lessonResults, setLessonResults] = useState<any>(null);

  const steps: { key: LessonStep; label: string }[] = [
    { key: 'content', label: translate('lesson.step.content') || 'Content' },
    { key: 'vocabulary', label: translate('lesson.step.vocabulary') || 'Vocabulary' },
    { key: 'grammar', label: translate('lesson.step.grammar') || 'Grammar' },
    { key: 'practice', label: translate('lesson.step.practice') || 'Practice' },
    { key: 'quiz', label: translate('lesson.step.quiz') || 'Quiz' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const handleStepComplete = (step: LessonStep) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.add(step);
      return newSet;
    });
  };

  const handleExerciseComplete = (exerciseId: string, score: number) => {
    setExerciseScores(prev => ({ ...prev, [exerciseId]: score }));
    if (score >= 70) {
      handleStepComplete('practice');
    }
  };

  const handleQuizComplete = (score: number) => {
    if (score >= 70) {
      handleStepComplete('quiz');
      onComplete(lesson.id);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'content':
        return <ContentStep lesson={lesson} onComplete={() => handleStepComplete('content')} />;
      case 'vocabulary':
        return (
          <VocabularyStep
            vocabulary={lesson.content.vocabulary || []}
            onComplete={() => handleStepComplete('vocabulary')}
          />
        );
      case 'grammar':
        return (
          <GrammarStep
            grammar={lesson.content.grammar || []}
            onComplete={() => handleStepComplete('grammar')}
          />
        );
      case 'practice':
        return (
          <PracticeStep
            exercises={lesson.exercises.filter(e => e.type !== 'pronunciation')}
            onExerciseComplete={handleExerciseComplete}
            lesson={lesson}
            onShowInteractive={() => setShowInteractiveFlow(true)}
          />
        );
      case 'quiz':
        return (
          <QuizStep
            exercises={lesson.exercises}
            onComplete={handleQuizComplete}
          />
        );
      default:
        return null;
    }
  };

  const allStepsComplete = completedSteps.size === steps.length;

  // Show interactive flow when user clicks practice
  if (showInteractiveFlow && !lessonResults) {
    return (
      <InteractiveLessonFlow
        lesson={lesson}
        onComplete={(results) => {
          setLessonResults(results);
          setShowInteractiveFlow(false);
          handleStepComplete('practice');
        }}
        onExit={() => {
          setShowInteractiveFlow(false);
        }}
      />
    );
  }

  // Show completion screen after interactive flow
  if (lessonResults) {
    return (
      <LessonComplete
        lessonTitle={lesson.title}
        totalScore={lessonResults.totalScore}
        xpEarned={lessonResults.xpEarned}
        correctAnswers={lessonResults.correctAnswers}
        totalExercises={lessonResults.totalExercises}
        streak={lessonResults.correctAnswers}
        onContinue={() => {
          setLessonResults(null);
          setCurrentStep('quiz');
        }}
        onReview={() => {
          setLessonResults(null);
          setShowInteractiveFlow(true);
        }}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onPrevious}
          disabled={!hasPrevious}
          sx={{ mb: 2 }}
        >
          {translate('common.back')}
        </Button>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Chip
            label={courseTitle}
            size="small"
            sx={{ bgcolor: themeColors.primary.light, color: 'white' }}
          />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, flex: 1 }}>
            {lesson.title}
          </Typography>
          {lesson.completed && (
            <CheckCircle sx={{ color: themeColors.success.main, fontSize: 32 }} />
          )}
        </Box>
        {lesson.description && (
          <Typography variant="body1" color="text.secondary" mb={2}>
            {lesson.description}
          </Typography>
        )}
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={currentStepIndex} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.key} completed={completedSteps.has(step.key)}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: completed
                        ? themeColors.success.main
                        : active
                        ? themeColors.primary.main
                        : themeColors.background.subtle,
                      color: completed || active ? 'white' : themeColors.text.secondary,
                    }}
                  >
                    {completed ? (
                      <CheckCircle sx={{ fontSize: 20 }} />
                    ) : (
                      <Typography variant="caption" fontWeight={600}>
                        {index + 1}
                      </Typography>
                    )}
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Lesson Content */}
      <Box sx={{ mb: 3 }}>{renderContent()}</Box>

      {/* Navigation */}
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => {
            const prevIndex = Math.max(0, currentStepIndex - 1);
            setCurrentStep(steps[prevIndex].key);
          }}
          disabled={currentStepIndex === 0}
        >
          {translate('common.previous')}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {allStepsComplete && (
            <Button
              variant="contained"
              color="success"
              endIcon={<CheckCircle />}
              onClick={() => onComplete(lesson.id)}
            >
              {translate('lesson.complete') || 'Complete Lesson'}
            </Button>
          )}
          {currentStepIndex < steps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => {
                const nextIndex = currentStepIndex + 1;
                setCurrentStep(steps[nextIndex].key);
              }}
            >
              {translate('common.next')}
            </Button>
          ) : (
            hasNext && (
              <Button variant="contained" endIcon={<ArrowForward />} onClick={onNext}>
                {translate('lesson.nextLesson') || 'Next Lesson'}
              </Button>
            )
          )}
        </Box>
      </Paper>
    </Container>
  );
};

// Content Step Component
const ContentStep: React.FC<{ lesson: Lesson; onComplete: () => void }> = ({
  lesson,
  onComplete,
}) => {
  const { translate } = useLanguage();

  return (
    <Paper sx={{ p: 3 }}>
      {lesson.imageUrl && (
        <Box
          component="img"
          src={lesson.imageUrl}
          alt={lesson.title}
          sx={{
            width: '100%',
            maxHeight: 300,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 3,
          }}
        />
      )}

      <Box sx={{ mb: 3 }}>
        <TranslationDisplay
          text={lesson.content.text}
          translation={lesson.content.translation}
          language={lesson.courseId.split('-')[0]} // Extract language from courseId
          showTranslation={!!lesson.content.translation}
          size="large"
        />
      </Box>

      {lesson.audioUrl && (
        <Box sx={{ mb: 3 }}>
          <AudioPlayer src={lesson.audioUrl} autoPlay={false} />
        </Box>
      )}

      {lesson.content.examples && lesson.content.examples.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {translate('lesson.examples') || 'Examples'}
          </Typography>
          {lesson.content.examples.map((example, idx) => (
            <Card key={idx} sx={{ mb: 2 }}>
              <CardContent>
                <TranslationDisplay
                  text={example.text}
                  translation={example.translation}
                  language={lesson.courseId.split('-')[0]}
                  showTranslation={true}
                />
                {example.audioUrl && (
                  <Box sx={{ mt: 1 }}>
                    <AudioPlayer src={example.audioUrl} autoPlay={false} />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button variant="contained" onClick={onComplete}>
          {translate('common.next')}
        </Button>
      </Box>
    </Paper>
  );
};

// Vocabulary Step Component
const VocabularyStep: React.FC<{
  vocabulary: VocabularyItem[];
  onComplete: () => void;
}> = ({ vocabulary, onComplete }) => {
  const { translate } = useLanguage();
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {translate('lesson.vocabulary') || 'Vocabulary'}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
        {vocabulary.map((item, idx) => (
          <Card
            key={idx}
            sx={{
              cursor: 'pointer',
              border: selectedWord === item ? `2px solid ${themeColors.primary.main}` : '1px solid transparent',
              '&:hover': {
                borderColor: themeColors.primary.light,
              },
            }}
            onClick={() => setSelectedWord(item)}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.word}
                </Typography>
                {item.audioUrl && (
                  <IconButton size="small" onClick={(e) => {
                    e.stopPropagation();
                    // Play audio
                  }}>
                    <VolumeUp fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {item.translation}
              </Typography>
              {item.pronunciation && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {item.pronunciation}
                </Typography>
              )}
              {item.example && (
                <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    {item.example}
                  </Typography>
                  {item.exampleTranslation && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                      {item.exampleTranslation}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button variant="contained" onClick={onComplete}>
          {translate('common.next')}
        </Button>
      </Box>
    </Paper>
  );
};

// Grammar Step Component
const GrammarStep: React.FC<{
  grammar: GrammarPoint[];
  onComplete: () => void;
}> = ({ grammar, onComplete }) => {
  const { translate } = useLanguage();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {translate('lesson.grammar') || 'Grammar'}
      </Typography>
      {grammar.map((point, idx) => (
        <Card key={idx} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {point.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {point.explanation}
            </Typography>
            {point.examples.map((example, exIdx) => (
              <Box key={exIdx} sx={{ mb: 2, pl: 2, borderLeft: `3px solid ${themeColors.primary.light}` }}>
                <TranslationDisplay
                  text={example.text}
                  translation={example.translation}
                  language="cr"
                  showTranslation={true}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button variant="contained" onClick={onComplete}>
          {translate('common.next')}
        </Button>
      </Box>
    </Paper>
  );
};

// Practice Step Component
const PracticeStep: React.FC<{
  exercises: Lesson['exercises'];
  onExerciseComplete: (exerciseId: string, score: number) => void;
  lesson: Lesson;
  onShowInteractive: () => void;
}> = ({ exercises, lesson, onShowInteractive }) => {
  const { translate } = useLanguage();

  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {translate('lesson.readyToPractice') || 'Ready to Practice?'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {translate('lesson.practiceDescription') || `You'll complete ${exercises.length} interactive exercises to master this lesson.`}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onShowInteractive}
        sx={{
          mt: 2,
          px: 6,
          py: 2,
          fontSize: '1.1rem',
          background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${themeColors.success.dark}, ${themeColors.success.main})`,
          },
        }}
      >
        {translate('lesson.startPractice') || 'START PRACTICE'}
      </Button>
    </Paper>
  );
};

// Quiz Step Component
const QuizStep: React.FC<{
  exercises: Lesson['exercises'];
  onComplete: (score: number) => void;
}> = ({ exercises, onComplete }) => {
  const { translate } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const currentExercise = exercises[currentIndex];

  const handleExerciseComplete = (score: number) => {
    setScores(prev => [...prev, score]);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const averageScore = scores.reduce((a, b) => a + b, score) / (scores.length + 1);
      onComplete(averageScore);
    }
  };

  if (!currentExercise) {
    const finalScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {translate('lesson.quizComplete') || 'Quiz Complete!'}
        </Typography>
        <Typography variant="h5" sx={{ color: themeColors.primary.main, my: 2 }}>
          {Math.round(finalScore)}%
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {finalScore >= 70
            ? translate('lesson.quizPassed') || 'Great job! You passed!'
            : translate('lesson.quizRetry') || 'Keep practicing! You can retry.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {translate('lesson.quiz') || 'Quiz'} {currentIndex + 1} / {exercises.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((currentIndex + 1) / exercises.length) * 100}
          sx={{ mt: 1, height: 8, borderRadius: 4 }}
        />
      </Box>
      <QuizComponent exercise={currentExercise} onComplete={handleExerciseComplete} />
    </Box>
  );
};

