import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { Mic, MicOff, VolumeUp, Videocam, VideocamOff } from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';

interface PronunciationExerciseProps {
  targetText: string;
  targetTranslation?: string;
  onComplete: (score: number) => void;
  enableCamera?: boolean;
}

export const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({
  targetText,
  targetTranslation,
  onComplete,
  enableCamera = false,
}) => {
  const { translate } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraEnabled(true);
    } catch (error) {
      console.error('Camera access error:', error);
      alert(translate('pronunciation.cameraError') || 'Could not access camera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

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
      const formData = new FormData();
      formData.append('file', audioBlob, 'pronunciation.wav');
      formData.append('target_text', targetText);
      formData.append('language_code', 'cr');

      // TODO: Call backend API
      // For now, mock response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const mockFeedback = mockScore >= 85 
        ? translate('pronunciation.excellent') || 'Excellent pronunciation!' 
        : mockScore >= 70 
        ? translate('pronunciation.good') || 'Good! Keep practicing.'
        : translate('pronunciation.tryAgain') || 'Try again, focus on the vowel sounds.';
      
      setScore(mockScore);
      setFeedback(mockFeedback);
      
      setTimeout(() => {
        onComplete(mockScore);
      }, 2000);
    } catch (error) {
      console.error('Error evaluating pronunciation:', error);
      setFeedback('Error processing audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const playReferenceAudio = () => {
    // TODO: Play reference audio
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(targetText);
      utterance.lang = 'cr'; // Cree language code
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Box>
      {/* Target Text */}
      <Card
        sx={{
          p: 4,
          mb: 3,
          background: `linear-gradient(135deg, ${themeColors.accent.turquoise}15, ${themeColors.accent.coral}15)`,
          border: `3px solid ${themeColors.accent.turquoise}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          {translate('pronunciation.sayThis') || 'Say this in Cree:'}
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ 
            my: 2,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${themeColors.primary.dark}, ${themeColors.primary.light})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {targetText}
        </Typography>
        {targetTranslation && (
          <Typography variant="h6" color="text.secondary">
            {targetTranslation}
          </Typography>
        )}
        <IconButton
          onClick={playReferenceAudio}
          sx={{
            mt: 2,
            bgcolor: themeColors.secondary.main,
            color: 'white',
            '&:hover': {
              bgcolor: themeColors.secondary.dark,
            },
          }}
        >
          <VolumeUp />
        </IconButton>
      </Card>

      {/* Camera Feed (Optional - Presage Integration) */}
      {enableCamera && (
        <Card sx={{ mb: 3, overflow: 'hidden' }}>
          {!cameraEnabled ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Videocam sx={{ fontSize: 48, color: themeColors.text.light, mb: 1 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {translate('pronunciation.cameraHelp') || 'Enable camera for personalized feedback'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Videocam />}
                onClick={startCamera}
                sx={{ mt: 2 }}
              >
                {translate('pronunciation.enableCamera') || 'Enable Camera'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ position: 'relative' }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <IconButton
                onClick={stopCamera}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <VideocamOff />
              </IconButton>
              <Chip
                label="🎥 Analyzing engagement..."
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                }}
              />
            </Box>
          )}
        </Card>
      )}

      {/* Recording Interface */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {!isRecording && !isProcessing && !score && (
          <Button
            variant="contained"
            size="large"
            startIcon={<Mic />}
            onClick={startRecording}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              background: `linear-gradient(135deg, ${themeColors.error.main}, ${themeColors.error.light})`,
              borderRadius: 50,
              '&:hover': {
                background: `linear-gradient(135deg, ${themeColors.error.dark}, ${themeColors.error.main})`,
                transform: 'scale(1.05)',
              },
            }}
          >
            {translate('pronunciation.startRecording') || 'TAP TO SPEAK'}
          </Button>
        )}

        {isRecording && (
          <Box>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${themeColors.error.main}, ${themeColors.error.light})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                animation: 'pulse 1.5s ease-in-out infinite',
                cursor: 'pointer',
              }}
              onClick={stopRecording}
            >
              <Mic sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              {translate('pronunciation.listening') || 'Listening...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translate('pronunciation.tapToStop') || 'Tap to stop'}
            </Typography>
          </Box>
        )}

        {isProcessing && (
          <Box>
            <CircularProgress size={80} thickness={4} sx={{ color: themeColors.secondary.main }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {translate('pronunciation.analyzing') || 'Analyzing your pronunciation...'}
            </Typography>
          </Box>
        )}

        {score !== null && (
          <Alert
            severity={score >= 85 ? 'success' : score >= 70 ? 'info' : 'warning'}
            sx={{
              fontSize: '1.1rem',
              py: 2,
              textAlign: 'left',
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {translate('pronunciation.score') || 'Score'}: {score}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                mt: 2,
                mb: 1,
                height: 12,
                borderRadius: 6,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: score >= 85 ? themeColors.success.main : themeColors.warning.main,
                },
              }}
            />
            <Typography variant="body1" sx={{ mt: 1 }}>
              {feedback}
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};

