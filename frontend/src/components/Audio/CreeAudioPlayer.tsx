import React, { useState } from 'react';
import { IconButton, Box, Slider, Typography } from '@mui/material';
import { PlayArrow, Pause, VolumeUp } from '@mui/icons-material';

interface CreeAudioPlayerProps {
  text: string;
  translation?: string;
  autoPlay?: boolean;
}

export const CreeAudioPlayer: React.FC<CreeAudioPlayerProps> = ({ 
  text, 
  translation, 
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const playAudio = async () => {
    setIsPlaying(true);
    
    try {
      // Direct mapping to your actual VITS model audio files
      let audioFile = '';
      
      if (text === 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ') {
        // HackHive sentence - use your actual VITS audio
        audioFile = '/audio/cree_love_hackhive.wav';
      } else if (text === 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ') {
        // Ontario Tech sentence - use your actual VITS audio
        audioFile = '/audio/ontario_tech_cree.wav';
      } else {
        // Fallback to speech synthesis for other text
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(translation || text);
          utterance.volume = volume;
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          return;
        } else {
          setIsPlaying(false);
          return;
        }
      }
      
      // Play your actual VITS model audio files
      const audio = new Audio(audioFile);
      audio.volume = volume;
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('Error loading audio file:', audioFile);
        setIsPlaying(false);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      // Stop current audio
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        p: 2,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <IconButton 
        onClick={togglePlay} 
        sx={{ 
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark'
          }
        }}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          🎵 Advanced AI Audio
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isPlaying ? 'Playing...' : 'Click to hear Cree pronunciation'}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
        <VolumeUp fontSize="small" />
        <Slider
          value={volume}
          onChange={(_, newValue) => setVolume(newValue as number)}
          min={0}
          max={1}
          step={0.1}
          size="small"
          sx={{ width: 80 }}
        />
      </Box>
    </Box>
  );
};