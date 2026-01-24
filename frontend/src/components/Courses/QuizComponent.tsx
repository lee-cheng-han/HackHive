import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Card,
  CardContent,
  LinearProgress,
  Alert,
} from '@mui/material';
import { CheckCircle, Cancel, VolumeUp } from '@mui/icons-material';
import { Exercise } from '../../types/course';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { AudioPlayer } from '../Audio/AudioPlayer';

interface QuizComponentProps {
  exercise: Exercise;
  onComplete: (score: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ exercise, onComplete }) => {
  const { translate } = useLanguage();
  const [answer, setAnswer] = useState<string | string[]>('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // For RadioGroup, we need a string value
  const radioValue = typeof answer === 'string' ? answer : '';

  const handleSubmit = () => {
    if (!answer) return;

    let calculatedScore = 0;
    if (Array.isArray(exercise.correctAnswer)) {
      // For matching or multiple correct answers
      const userAnswers = Array.isArray(answer) ? answer : [answer];
      const correctAnswers = exercise.correctAnswer;
      const correctCount = userAnswers.filter(a => correctAnswers.includes(a)).length;
      calculatedScore = (correctCount / correctAnswers.length) * 100;
    } else {
      // Single correct answer
      const userAnswer = Array.isArray(answer) ? answer[0] : answer;
      calculatedScore = userAnswer === exercise.correctAnswer ? 100 : 0;
    }

    setScore(calculatedScore);
    setSubmitted(true);
    setShowExplanation(true);
    onComplete(calculatedScore);
  };

  const renderExercise = () => {
    switch (exercise.type) {
      case 'multiple-choice':
        return (
          <FormControl component="fieldset" fullWidth>
            <Typography variant="h6" gutterBottom>
              {exercise.question}
            </Typography>
            {exercise.questionTranslation && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                {exercise.questionTranslation}
              </Typography>
            )}
            <RadioGroup
              value={radioValue}
              onChange={(e) => setAnswer(e.target.value)}
            >
              {(exercise.options || []).map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio disabled={submitted} />}
                  label={
                    <Box>
                      <Typography>{option.text}</Typography>
                      {option.translation && (
                        <Typography variant="caption" color="text.secondary">
                          {option.translation}
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    border: submitted && option.isCorrect
                      ? `2px solid ${themeColors.success.main}`
                      : submitted && answer === option.id && !option.isCorrect
                      ? `2px solid ${themeColors.error || '#d32f2f'}`
                      : '1px solid transparent',
                    bgcolor: submitted && option.isCorrect
                      ? `${themeColors.success.main}20`
                      : 'transparent',
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'fill-blank':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {exercise.question}
            </Typography>
            {exercise.questionTranslation && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                {exercise.questionTranslation}
              </Typography>
            )}
            <TextField
              fullWidth
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              placeholder={translate('lesson.enterAnswer') || 'Enter your answer'}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 'translation':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {translate('lesson.translate') || 'Translate to English:'}
            </Typography>
            <Typography variant="h5" sx={{ my: 2, color: themeColors.primary.main }}>
              {exercise.question}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              placeholder={translate('lesson.enterTranslation') || 'Enter translation'}
            />
          </Box>
        );

      case 'listening':
        return (
          <Box>
            {exercise.audioUrl && (
              <Box sx={{ mb: 3 }}>
                <AudioPlayer src={exercise.audioUrl} autoPlay={false} />
              </Box>
            )}
            <Typography variant="h6" gutterBottom>
              {exercise.question || translate('lesson.whatDidYouHear') || 'What did you hear?'}
            </Typography>
            <TextField
              fullWidth
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              placeholder={translate('lesson.enterAnswer') || 'Enter what you heard'}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      default:
        return (
          <Typography>
            {exercise.question}
          </Typography>
        );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {renderExercise()}

      {submitted && (
        <Box sx={{ mt: 3 }}>
          <Alert
            severity={score >= 70 ? 'success' : 'warning'}
            icon={score >= 70 ? <CheckCircle /> : <Cancel />}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">
              {score >= 70
                ? translate('lesson.correct') || 'Correct!'
                : translate('lesson.incorrect') || 'Not quite right'}
            </Typography>
            <Typography variant="body2">
              {translate('lesson.score') || 'Score'}: {Math.round(score)}%
            </Typography>
          </Alert>

          {showExplanation && exercise.explanation && (
            <Card sx={{ bgcolor: themeColors.background.subtle, mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {translate('lesson.explanation') || 'Explanation'}
                </Typography>
                <Typography variant="body2">{exercise.explanation}</Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {!submitted && (
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!answer}
            size="large"
          >
            {translate('common.submit')}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

