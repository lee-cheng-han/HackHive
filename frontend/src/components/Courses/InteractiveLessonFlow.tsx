import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  EmojiEvents,
  LocalFireDepartment,
  TrendingUp,
} from '@mui/icons-material';
import { Lesson, Exercise } from '../../types/course';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExerciseCard } from './ExerciseCard';
import { DecorativeBorder, GradientText } from '../Common';

interface InteractiveLessonFlowProps {
  lesson: Lesson;
  onComplete: (results: LessonResults) => void;
  onExit: () => void;
}

interface LessonResults {
  lessonId: string;
  totalScore: number;
  xpEarned: number;
  correctAnswers: number;
  totalExercises: number;
  timeSpent: number;
}

export const InteractiveLessonFlow: React.FC<InteractiveLessonFlowProps> = ({
  lesson,
  onComplete,
  onExit,
}) => {
  const { translate } = useLanguage();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseScores, setExerciseScores] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [startTime] = useState(Date.now());
  const [showCelebration, setShowCelebration] = useState(false);
  const [hearts, setHearts] = useState(5); // Duolingo-style lives
  const [streak, setStreak] = useState(0);

  // Check if lesson has exercises
  const exercises = lesson.exercises || [];
  
  if (exercises.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          {translate('lesson.noExercises') || 'No exercises available for this lesson yet.'}
        </Typography>
        <Button variant="contained" onClick={onExit} sx={{ mt: 3 }}>
          {translate('common.back')}
        </Button>
      </Container>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const totalExercises = exercises.length;

  const handleExerciseComplete = (score: number, xpEarned: number) => {
    setExerciseScores(prev => [...prev, score]);
    setTotalXP(prev => prev + xpEarned);

    if (score >= 70) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setHearts(prev => Math.max(0, prev - 1));
    }

    if (isLastExercise) {
      // Lesson complete!
      setShowCelebration(true);
      setTimeout(() => {
        const results: LessonResults = {
          lessonId: lesson.id,
          totalScore: exerciseScores.reduce((a, b) => a + b, score) / (exerciseScores.length + 1),
          xpEarned: totalXP + xpEarned,
          correctAnswers: exerciseScores.filter(s => s >= 70).length + (score >= 70 ? 1 : 0),
          totalExercises: exercises.length,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
        };
        onComplete(results);
      }, 3000);
    } else {
      // Next exercise
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
      }, 1000);
    }
  };

  if (!currentExercise) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: themeColors.background.default,
        pb: 4,
      }}
    >
      {/* Header - Duolingo style */}
      <Paper
        elevation={0}
        sx={{
          py: 2,
          px: 3,
          borderBottom: `2px solid ${themeColors.background.subtle}`,
          bgcolor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton onClick={onExit}>
            <Close />
          </IconButton>

          {/* Hearts (lives) */}
          <Box display="flex" alignItems="center" gap={0.5}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  fontSize: '1.5rem',
                  opacity: i < hearts ? 1 : 0.2,
                  filter: i < hearts ? 'none' : 'grayscale(100%)',
                }}
              >
                ❤️
              </Box>
            ))}
          </Box>

          {/* Streak */}
          <Box display="flex" alignItems="center" gap={1}>
            <LocalFireDepartment 
              sx={{ 
                color: streak > 0 ? themeColors.accent.coral : themeColors.text.light,
                fontSize: 28
              }} 
            />
            <Typography variant="h6" fontWeight={700} color={streak > 0 ? themeColors.accent.coral : themeColors.text.light}>
              {streak}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Exercise Content */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <ExerciseCard
          exercise={currentExercise}
          exerciseNumber={currentExerciseIndex + 1}
          totalExercises={totalExercises}
          onComplete={handleExerciseComplete}
        />
      </Container>

      {/* Celebration Dialog */}
      <Dialog
        open={showCelebration}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
            color: 'white',
            textAlign: 'center',
            p: 4,
          },
        }}
      >
        <DialogContent>
          <Box sx={{ fontSize: '4rem', mb: 2 }}>🎉</Box>
          <GradientText variant="h3" gradient="sunset" sx={{ mb: 2, color: 'white !important' }}>
            {translate('lesson.complete') || 'Lesson Complete!'}
          </GradientText>
          <Box display="flex" justifyContent="center" gap={3} mt={3}>
            <Box>
              <EmojiEvents sx={{ fontSize: 48, color: themeColors.accent.amber }} />
              <Typography variant="h4" fontWeight={700}>
                +{totalXP}
              </Typography>
              <Typography variant="body2">XP</Typography>
            </Box>
            <Box>
              <CheckCircle sx={{ fontSize: 48 }} />
              <Typography variant="h4" fontWeight={700}>
                {exerciseScores.filter(s => s >= 70).length}/{totalExercises}
              </Typography>
              <Typography variant="body2">Correct</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

