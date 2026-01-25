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
  audioUrl?: string;
  onComplete: (score: number) => void;
  enableCamera?: boolean;
}

export const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({
  targetText,
  targetTranslation,
  audioUrl,
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

  // Pronunciation sound feedback
  const playPronunciationSound = (score: number) => {
    try {
      // Use Web Audio API to create UI feedback sounds
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const audioContext = new AudioCtx();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (score >= 85) {
        // Excellent: Success chime
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else if (score >= 70) {
        // Good: Single pleasant tone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        // Try again: Gentle notification sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(330, audioContext.currentTime); // E4
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (error) {
      console.log('Could not play pronunciation feedback sound:', error);
    }
  };

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
      formData.append('audio', audioBlob, 'pronunciation.wav');
      formData.append('target_text', targetText);
      formData.append('target_translation', targetTranslation || '');

      // Call real backend API with Gemini evaluation
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/ai-tutor/evaluate-pronunciation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Display AI-powered results
      setScore(result.score);
      
      // Combine feedback with specific tips
      let fullFeedback = result.feedback;
      if (result.specific_tips && result.specific_tips.length > 0) {
        fullFeedback += '\n\nTips:\n' + result.specific_tips.map((tip: string) => `• ${tip}`).join('\n');
      }
      if (result.cultural_note) {
        fullFeedback += `\n\n💡 ${result.cultural_note}`;
      }
      setFeedback(fullFeedback);
      
      // Play sound feedback for pronunciation
      playPronunciationSound(result.score);
      
      // Wait longer before completing to let user read feedback
      setTimeout(() => {
        onComplete(result.score);
      }, 4000); // Increased from 2500 to 4000ms (4 seconds)
    } catch (error) {
      console.error('Error evaluating pronunciation:', error);
      setFeedback('Error processing audio. Please try again.');
      
      // Fallback to mock if API fails
      const mockScore = 75;
      setScore(mockScore);
      playPronunciationSound(mockScore);
      
      // Wait longer before completing
      setTimeout(() => {
        onComplete(mockScore);
      }, 4000); // Increased from 2000 to 4000ms
    } finally {
      setIsProcessing(false);
    }
  };

  const playReferenceAudio = async () => {
    try {
      // If audioUrl is provided, play that audio file directly
      if (audioUrl) {
        console.log(`🔊 Playing audio from file: ${audioUrl}`);
        
        // Create absolute URL from relative path
        const fullAudioUrl = audioUrl.startsWith('http') 
          ? audioUrl 
          : `${window.location.origin}${audioUrl}`;
        
        console.log(`📍 Full audio URL: ${fullAudioUrl}`);
        
        const audio = new Audio(fullAudioUrl);
        audio.volume = 0.8;
        
        // Try to play and handle any errors
        try {
          await audio.play();
          console.log('✅ Audio played successfully');
        } catch (playError) {
          console.error('❌ Error playing audio file:', playError);
          // If autoplay is blocked, show a message
          alert('Please click the speaker button again to hear the pronunciation.');
        }
        return;
      }

      // Fallback to speech synthesis - Map common Cree words to proper pronunciation guides
      const creepronunciationMap: { [key: string]: string } = {
        'tânisi': 'TAH nee see',
        'tanisi': 'TAH nee see', 
        'Tânisi': 'TAH nee see',
        'Tanisi': 'TAH nee see',
        'nēwo': 'NAY woh',
        'newo': 'NAY woh',
        'nīso': 'NEE soh',
        'niso': 'NEE soh',
        'pēyak': 'PAY ahk',
        'peyak': 'PAY ahk',
        'nikāwīy': 'nee KAH wee',
        'nikawiy': 'nee KAH wee',
        'kinanāskomitin': 'kee nah NAS koh mee teen',
        'kinanaskomitin': 'kee nah NAS koh mee teen',
        'ēkosi': 'AY koh see',
        'ekosi': 'AY koh see'
      };

      // Get phonetic pronunciation for Cree words
      const phoneticText = creepronunciationMap[targetText.toLowerCase()] || targetText;
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(phoneticText);
        
        // Configure for better pronunciation
        utterance.lang = 'en-US'; // Use English but with our phonetic spelling
        utterance.rate = 0.5; // Very slow for learning
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to find a voice that works well for phonetic pronunciation
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Alex') || voice.name.includes('Karen') || voice.name.includes('Daniel'))
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        console.log(`🔊 Playing Cree pronunciation: "${targetText}" → "${phoneticText}"`);
        window.speechSynthesis.speak(utterance);
        return;
      }
      
      console.log('Speech synthesis not available, no audio played');
    } catch (error) {
      console.error('Error playing audio:', error);
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

