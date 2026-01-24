import React, { useState, useRef } from 'react';
import { Button, Box, CircularProgress, Alert } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';
import { voiceApi } from '../../services/api';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  languageCode: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscription,
  languageCode,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Microphone access denied. Please enable it in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await voiceApi.transcribe(audioBlob, languageCode);
      onTranscription(response.transcription);
    } catch (error: any) {
      console.error('Transcription error:', error);
      
      // Check if backend is not available
      if (error.message?.includes('not running') || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        // Mock transcription for testing when backend is not available
        console.warn('Backend not available, using mock transcription');
        const mockTranscriptions = [
          'Hello',
          'Tānisi',
          'How are you?',
          'I understand',
          'Thank you',
          'Yes',
          'No',
        ];
        const mockText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
        setTimeout(() => {
          onTranscription(`[Mock] ${mockText}`);
          setIsProcessing(false);
        }, 1000);
        return;
      }
      
      // Show error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to transcribe audio';
      setError(`Transcription failed: ${errorMessage}`);
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
          {error.includes('not running') && (
            <Box component="div" sx={{ mt: 1, fontSize: '0.875rem' }}>
              To enable real transcription:
              <br />1. Start backend: <code>cd backend && python run.py</code>
              <br />2. Start ML service: <code>cd ml-service && uvicorn app.main:app --port 5000</code>
            </Box>
          )}
        </Alert>
      )}
      
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color={isRecording ? 'error' : 'primary'}
          startIcon={isRecording ? <MicOff /> : <Mic />}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        {isProcessing && <CircularProgress size={24} />}
        {isRecording && (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'error.main',
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};
