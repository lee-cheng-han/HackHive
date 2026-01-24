import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  CheckCircle,
  ArrowForward,
  Refresh,
  LocalFireDepartment,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { DecorativeBorder } from '../Common';

interface LessonCompleteProps {
  lessonTitle: string;
  totalScore: number;
  xpEarned: number;
  correctAnswers: number;
  totalExercises: number;
  streak: number;
  onContinue: () => void;
  onReview?: () => void;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({
  lessonTitle,
  totalScore,
  xpEarned,
  correctAnswers,
  totalExercises,
  streak,
  onContinue,
  onReview,
}) => {
  const { translate } = useLanguage();
  const accuracy = (correctAnswers / totalExercises) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {/* Celebration Animation */}
        <Box sx={{ fontSize: '5rem', mb: 2, animation: 'pulse 2s ease-in-out infinite' }}>
          {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}
        </Box>

        <Typography 
          variant="h2"
          sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${themeColors.accent.amber}, ${themeColors.accent.coral})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {accuracy >= 90 
            ? translate('lesson.perfect') || 'Perfect!' 
            : accuracy >= 70 
            ? translate('lesson.greatJob') || 'Great Job!' 
            : translate('lesson.keepPracticing') || 'Keep Practicing!'}
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          {lessonTitle}
        </Typography>
      </Box>

      <DecorativeBorder variant="gradient" thickness={4} />

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, my: 4 }}>
        {/* XP Earned */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${themeColors.accent.amber}, ${themeColors.accent.coral})`,
            color: 'white',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <EmojiEvents sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              +{xpEarned}
            </Typography>
            <Typography variant="body2">XP</Typography>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
            color: 'white',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {Math.round(accuracy)}%
            </Typography>
            <Typography variant="body2">
              {translate('lesson.accuracy') || 'Accuracy'}
            </Typography>
          </CardContent>
        </Card>

        {/* Correct Answers */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${themeColors.accent.turquoise}, ${themeColors.secondary.main})`,
            color: 'white',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {correctAnswers}/{totalExercises}
            </Typography>
            <Typography variant="body2">
              {translate('lesson.correct') || 'Correct'}
            </Typography>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${themeColors.accent.coral}, ${themeColors.accent.sunset})`,
            color: 'white',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <LocalFireDepartment sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {streak}
            </Typography>
            <Typography variant="body2">
              {translate('lesson.streak') || 'Streak'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Progress Bar */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {translate('lesson.overallProgress') || 'Overall Progress'}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={accuracy}
          sx={{
            height: 16,
            borderRadius: 8,
            bgcolor: themeColors.background.subtle,
            '& .MuiLinearProgress-bar': {
              borderRadius: 8,
              background: `linear-gradient(90deg, ${themeColors.accent.turquoise}, ${themeColors.success.main})`,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {correctAnswers} {translate('lesson.outOf') || 'out of'} {totalExercises} {translate('lesson.exercises') || 'exercises completed'}
        </Typography>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          onClick={onContinue}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${themeColors.success.dark}, ${themeColors.success.main})`,
            },
          }}
        >
          {translate('lesson.continue') || 'CONTINUE'}
        </Button>

        {onReview && accuracy < 90 && (
          <Button
            variant="outlined"
            size="large"
            startIcon={<Refresh />}
            onClick={onReview}
            sx={{
              py: 2,
              fontSize: '1rem',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            {translate('lesson.review') || 'Review Lesson'}
          </Button>
        )}
      </Box>

      <DecorativeBorder variant="gradient" thickness={4} />
    </Container>
  );
};

