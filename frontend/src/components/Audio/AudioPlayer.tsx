import React, { useState, useEffect } from 'react';
import { IconButton, Box, Slider } from '@mui/material';
import { PlayArrow, Pause, VolumeUp } from '@mui/icons-material';
import { Howl } from 'howler';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [howl, setHowl] = useState<Howl | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!src) return;

    const sound = new Howl({
      src: [src],
      volume: volume,
      onend: () => setIsPlaying(false),
    });

    setHowl(sound);

    if (autoPlay) {
      sound.play();
      setIsPlaying(true);
    }

    return () => {
      sound.unload();
    };
  }, [src, autoPlay]);

  useEffect(() => {
    if (howl) {
      howl.volume(volume);
    }
  }, [volume, howl]);

  const togglePlay = () => {
    if (!howl) return;

    if (isPlaying) {
      howl.pause();
    } else {
      howl.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!src) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
      <IconButton onClick={togglePlay} color="primary">
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <VolumeUp sx={{ color: 'text.secondary' }} />
      <Slider
        value={volume}
        min={0}
        max={1}
        step={0.1}
        onChange={(_, value) => setVolume(value as number)}
        sx={{ width: 100 }}
      />
    </Box>
  );
};

