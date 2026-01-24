import React, { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { StoryScene as StorySceneType } from '../../types/story';
import { StoryImage } from './StoryImage';
import { AudioPlayer } from '../Audio/AudioPlayer';
import { speechService } from '../../services/speech';

interface StorySceneProps {
  scene: StorySceneType;
  onChoiceSelect: (choiceId: string, nextScene: string) => void;
  autoPlayAudio?: boolean;
  showSubtitles?: boolean;
}

export const StoryScene: React.FC<StorySceneProps> = ({
  scene,
  onChoiceSelect,
  autoPlayAudio = true,
  showSubtitles = true,
}) => {
  useEffect(() => {
    // Auto-speak text if TTS is enabled and supported
    if (autoPlayAudio && speechService.isSupported()) {
      speechService.speak(scene.text);
    }
    
    // Cleanup: stop speaking when component unmounts
    return () => {
      speechService.stopSpeaking();
    };
  }, [scene.id, autoPlayAudio, scene.text]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      {scene.image_url && <StoryImage src={scene.image_url} alt={scene.text} />}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" component="p" sx={{ mb: 1 }}>
          {scene.text}
        </Typography>
        {scene.text_translation && (
          <Typography variant="body2" color="text.secondary">
            {scene.text_translation}
          </Typography>
        )}
      </Box>

      {scene.audio_url && (
        <AudioPlayer src={scene.audio_url} autoPlay={autoPlayAudio} />
      )}
    </Paper>
  );
};

