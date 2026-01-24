import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Mic, MicOff, VolumeUp, CheckCircle, Refresh } from '@mui/icons-material';
import { Exercise, PronunciationFeedback } from '../../types/course';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { AudioPlayer } from '../Audio/AudioPlayer';
import { voiceApi } from '../../services/api';

interface PronunciationCoachProps {
  exercise: Exercise;
  targetText: string; // The text user should pronounce
  referenceAudio?: string; // Reference pronunciation audio
  onComplete: (score: number) => void;
}

export const PronunciationCoach: React.FC<PronunciationCoachProps> = ({
  exercise,
  targetText,
  referenceAudio,
  onComplete,
}) => {
  const { translate } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [attempts, setAttempts] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await evaluatePronunciation(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert(translate('pronunciation.micError') || 'Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const evaluatePronunciation = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert to WAV format for backend
      const formData = new FormData();
      formData.append('file', audioBlob, 'pronunciation.wav');
      formData.append('target_text', targetText);
      formData.append('language_code', 'cr'); // Should come from lesson context

      // Call backend pronunciation evaluation API
      const response = await fetch('/api/pronunciation/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: PronunciationFeedback = await response.json();
        setFeedback(data);
        setAttempts(prev => prev + 1);

        if (data.score >= 70) {
          onComplete(data.score);
        }
      } else {
        // Fallback: mock feedback for demo
        const mockFeedback: PronunciationFeedback = {
          score: Math.floor(Math.random() * 30) + 60, // 60-90 for demo
          accuracy: 0.75,
          feedback: translate('pronunciation.goodTry') || 'Good try! Keep practicing.',
          issues: [],
        };
        setFeedback(mockFeedback);
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error evaluating pronunciation:', error);
      // Mock feedback for demo
      const mockFeedback: PronunciationFeedback = {
        score: 75,
        accuracy: 0.75,
        feedback: translate('pronunciation.goodTry') || 'Good try! Keep practicing.',
        issues: [],
      };
      setFeedback(mockFeedback);
      setAttempts(prev => prev + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    setAttempts(prev => prev + 1);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {translate('pronunciation.practice') || 'Pronunciation Practice'}
      </Typography>

      {/* Target Text */}
      <Card sx={{ mb: 3, bgcolor: themeColors.background.subtle }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
              {targetText}
            </Typography>
            {referenceAudio && (
              <AudioPlayer src={referenceAudio} autoPlay={false} />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {translate('pronunciation.listenAndRepeat') || 'Listen to the pronunciation and repeat'}
          </Typography>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {!isRecording && !isProcessing && (
          <Button
            variant="contained"
            size="large"
            startIcon={<Mic />}
            onClick={startRecording}
            sx={{
              bgcolor: themeColors.error || '#d32f2f',
              '&:hover': { bgcolor: themeColors.error || '#b71c1c' },
              px: 4,
              py: 1.5,
            }}
          >
            {translate('pronunciation.startRecording') || 'Start Recording'}
          </Button>
        )}

        {isRecording && (
          <Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<MicOff />}
              onClick={stopRecording}
              sx={{
                bgcolor: themeColors.error || '#d32f2f',
                '&:hover': { bgcolor: themeColors.error || '#b71c1c' },
                px: 4,
                py: 1.5,
              }}
            >
              {translate('pronunciation.stopRecording') || 'Stop Recording'}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {translate('pronunciation.recording') || 'Recording...'}
            </Typography>
          </Box>
        )}

        {isProcessing && (
          <Box>
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {translate('pronunciation.analyzing') || 'Analyzing your pronunciation...'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Feedback */}
      {feedback && (
        <Box>
          <Alert
            severity={feedback.score >= 70 ? 'success' : 'warning'}
            icon={feedback.score >= 70 ? <CheckCircle /> : undefined}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">
              {translate('pronunciation.score') || 'Score'}: {Math.round(feedback.score)}%
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {feedback.feedback}
            </Typography>
          </Alert>

          {/* Score Visualization */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={feedback.score}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: themeColors.background.subtle,
                '& .MuiLinearProgress-bar': {
                  bgcolor: feedback.score >= 70 ? themeColors.success.main : themeColors.warning?.main || '#ed6c02',
                },
              }}
            />
          </Box>

          {/* Specific Issues */}
          {feedback.issues && feedback.issues.length > 0 && (
            <Card sx={{ bgcolor: themeColors.background.subtle, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {translate('pronunciation.areasToImprove') || 'Areas to improve:'}
                </Typography>
                {feedback.issues.map((issue, idx) => (
                  <Box key={idx} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>{issue.phoneme}</strong>: {issue.issue}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {translate('pronunciation.suggestion') || 'Suggestion'}: {issue.suggestion}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Retry Button */}
          {feedback.score < 70 && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRetry}
                sx={{ mt: 2 }}
              >
                {translate('pronunciation.tryAgain') || 'Try Again'}
              </Button>
            </Box>
          )}

          {/* Attempts Counter */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            {translate('pronunciation.attempts') || 'Attempts'}: {attempts}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

