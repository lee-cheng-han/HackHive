import React from 'react';
import { Box } from '@mui/material';

interface StoryImageProps {
  src: string;
  alt: string;
}

export const StoryImage: React.FC<StoryImageProps> = ({ src, alt }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: '400px',
        overflow: 'hidden',
        borderRadius: 2,
        mb: 2,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
        onError={(e) => {
          // Fallback if image fails to load
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </Box>
  );
};

