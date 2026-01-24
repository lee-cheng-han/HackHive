import React from 'react';
import { Box, Typography } from '@mui/material';

interface SubtitleDisplayProps {
  text: string;
}

export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ text }) => {
  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: 1,
      }}
    >
      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
        {text}
      </Typography>
    </Box>
  );
};

