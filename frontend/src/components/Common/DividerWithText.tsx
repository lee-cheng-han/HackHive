import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface DividerWithTextProps {
  text: string;
  variant?: 'primary' | 'secondary';
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({
  text,
  variant = 'primary',
}) => {
  const color =
    variant === 'primary' ? themeColors.primary.main : themeColors.secondary.main;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
      <Divider sx={{ flex: 1, borderColor: color }} />
      <Typography
        variant="body2"
        sx={{
          px: 2,
          color: color,
          fontWeight: 600,
        }}
      >
        {text}
      </Typography>
      <Divider sx={{ flex: 1, borderColor: color }} />
    </Box>
  );
};

