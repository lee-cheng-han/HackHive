import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Card,
  LinearProgress,
  Alert,
  Fade,
  Chip,
} from '@mui/material';
import { CheckCircle, Cancel, VolumeUp, Mic, EmojiEvents } from '@mui/icons-material';
import { Exercise } from '../../types/course';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { PatternCard, GradientText } from '../Common';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseNumber: number;
  totalExercises: number;
  onComplete: (score: number, xpEarned: number) => void;
  onSkip?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseNumber,
  totalExercises,
  onComplete,
  onSkip,
}) => {
  const { translate } = useLanguage();
  const [answer, setAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const handleSubmit = () => {
    if (!answer) return;

    let correct = false;
    let score = 0;

    // Check answer based on exercise type
    if (exercise.type === 'multiple-choice') {
      // For multiple choice, check if selected option ID matches correct answer
      correct = answer === exercise.correctAnswer;
      score = correct ? 100 : 0;
    } else {
      // For text-based answers (fill-blank, translation)
      const userAnswer = answer.trim().toLowerCase();
      const correctAnswer = typeof exercise.correctAnswer === 'string' 
        ? exercise.correctAnswer.trim().toLowerCase()
        : Array.isArray(exercise.correctAnswer) && exercise.correctAnswer.length > 0
        ? exercise.correctAnswer[0].trim().toLowerCase()
        : '';
      
      correct = userAnswer === correctAnswer;
      score = correct ? 100 : 0;
    }
    
    const xp = correct ? (exercise.points || 10) : 0;

    setIsCorrect(correct);
    setXpEarned(xp);
    setSubmitted(true);
    setShowFeedback(true);

    // Don't auto-progress - let user click CONTINUE button
    // This is more like Duolingo and gives time to read feedback
  };

  const handleContinue = () => {
    const score = isCorrect ? 100 : 0;
    console.log('Continuing to next exercise...', { score, xpEarned });
    onComplete(score, xpEarned);
  };

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case 'multiple-choice':
        return (
          <Box>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: themeColors.text.primary,
                mb: 3,
                textAlign: 'center'
              }}
            >
              {exercise.question}
            </Typography>
            
            {exercise.questionTranslation && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                {exercise.questionTranslation}
              </Typography>
            )}

            <RadioGroup
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(exercise.options || []).map((option) => (
                  <Card
                    key={option.id}
                    sx={{
                      cursor: 'pointer',
                      border: `3px solid ${
                        submitted && option.isCorrect
                          ? themeColors.success.main
                          : submitted && answer === option.id && !option.isCorrect
                          ? themeColors.error.main
                          : answer === option.id
                          ? themeColors.primary.main
                          : themeColors.background.subtle
                      }`,
                      bgcolor: submitted && option.isCorrect
                        ? `${themeColors.success.main}15`
                        : submitted && answer === option.id && !option.isCorrect
                        ? `${themeColors.error.main}15`
                        : 'white',
                      transform: answer === option.id ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                    }}
                    onClick={() => !submitted && setAnswer(option.id)}
                  >
                    <FormControlLabel
                      value={option.id}
                      control={<Radio disabled={submitted} sx={{ display: 'none' }} />}
                      label={
                        <Box sx={{ p: 2, width: '100%' }}>
                          <Typography variant="h6" fontWeight={600}>
                            {option.text}
                          </Typography>
                          {option.translation && (
                            <Typography variant="body2" color="text.secondary">
                              {option.translation}
                            </Typography>
                          )}
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Card>
                ))}
              </Box>
            </RadioGroup>
          </Box>
        );

      case 'fill-blank':
      case 'translation':
        return (
          <Box>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                textAlign: 'center',
                mb: 3
              }}
            >
              {exercise.question}
            </Typography>
            
            {exercise.questionTranslation && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                {exercise.questionTranslation}
              </Typography>
            )}

            <TextField
              fullWidth
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              placeholder={translate('lesson.enterAnswer') || 'Type your answer'}
              variant="outlined"
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.25rem',
                  padding: '12px',
                  bgcolor: 'white',
                  borderRadius: 2,
                  border: `3px solid ${submitted ? (isCorrect ? themeColors.success.main : themeColors.error.main) : themeColors.background.subtle}`,
                  '&:hover': {
                    borderColor: submitted ? undefined : themeColors.primary.light,
                  },
                  '&.Mui-focused': {
                    borderColor: themeColors.primary.main,
                  },
                },
              }}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && answer && !submitted) {
                  handleSubmit();
                }
              }}
            />
          </Box>
        );

      default:
        return (
          <Typography>{exercise.question}</Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Progress Bar - Duolingo style */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {exerciseNumber} / {totalExercises}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEvents sx={{ color: themeColors.accent.amber, fontSize: 20 }} />
            <Typography variant="body2" fontWeight={700} color={themeColors.accent.amber}>
              {exercise.points || 10} XP
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(exerciseNumber / totalExercises) * 100}
          sx={{
            height: 14,
            borderRadius: 7,
            bgcolor: themeColors.background.subtle,
            '& .MuiLinearProgress-bar': {
              borderRadius: 7,
              background: `linear-gradient(90deg, ${themeColors.accent.turquoise}, ${themeColors.success.main})`,
            },
          }}
        />
      </Box>

      {/* Exercise Content */}
      <Fade in={!showFeedback} timeout={300}>
        <Box sx={{ flex: 1, display: showFeedback ? 'none' : 'block' }}>
          {renderExerciseContent()}
        </Box>
      </Fade>

      {/* Feedback - Duolingo style */}
      {showFeedback && (
        <Fade in={showFeedback} timeout={500}>
          <Box>
            <Alert
              severity={isCorrect ? 'success' : 'error'}
              icon={isCorrect ? <CheckCircle fontSize="large" /> : <Cancel fontSize="large" />}
              sx={{
                fontSize: '1.1rem',
                py: 3,
                borderRadius: 3,
                border: `3px solid ${isCorrect ? themeColors.success.main : themeColors.error.main}`,
                bgcolor: isCorrect ? `${themeColors.success.main}15` : `${themeColors.error.main}15`,
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {isCorrect 
                  ? translate('lesson.correct') || '✨ Excellent!' 
                  : translate('lesson.incorrect') || 'Not quite'}
              </Typography>
              
              {!isCorrect && exercise.explanation && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {exercise.explanation}
                </Typography>
              )}
              
              {isCorrect && xpEarned > 0 && (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <Typography variant="h6" fontWeight={700} color={themeColors.accent.amber}>
                    +{xpEarned} XP
                  </Typography>
                  <EmojiEvents sx={{ color: themeColors.accent.amber }} />
                </Box>
              )}
            </Alert>
          </Box>
        </Fade>
      )}

      {/* Action Buttons */}
      {!submitted && (
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          {onSkip && (
            <Button
              variant="outlined"
              size="large"
              onClick={onSkip}
              sx={{ 
                px: 4,
                borderColor: themeColors.text.light,
                color: themeColors.text.secondary,
              }}
            >
              {translate('common.skip') || 'Skip'}
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!answer}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${themeColors.success.dark}, ${themeColors.success.main})`,
              },
              '&:disabled': {
                background: themeColors.background.subtle,
                color: themeColors.text.light,
              },
            }}
          >
            {translate('common.check') || 'CHECK'}
          </Button>
        </Box>
      )}

      {/* Continue Button - Shows after feedback (Duolingo style) */}
      {submitted && showFeedback && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            sx={{
              px: 8,
              py: 2,
              fontSize: '1.1rem',
              background: isCorrect 
                ? `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`
                : `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.light})`,
              '&:hover': {
                background: isCorrect
                  ? `linear-gradient(135deg, ${themeColors.success.dark}, ${themeColors.success.main})`
                  : `linear-gradient(135deg, ${themeColors.primary.dark}, ${themeColors.primary.main})`,
                transform: 'scale(1.02)',
              },
            }}
          >
            {translate('lesson.continue') || 'CONTINUE'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

