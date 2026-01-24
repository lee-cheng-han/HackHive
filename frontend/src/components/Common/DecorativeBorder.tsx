import React from 'react';
import { Box } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface DecorativeBorderProps {
  position?: 'top' | 'bottom' | 'both';
  variant?: 'simple' | 'geometric' | 'gradient';
  thickness?: number;
}

export const DecorativeBorder: React.FC<DecorativeBorderProps> = ({
  position = 'top',
  variant = 'gradient',
  thickness = 4,
}) => {
  const getBackground = () => {
    switch (variant) {
      case 'simple':
        return themeColors.primary.main;
      case 'geometric':
        return `repeating-linear-gradient(
          90deg,
          ${themeColors.accent.turquoise} 0px,
          ${themeColors.accent.turquoise} 10px,
          ${themeColors.accent.coral} 10px,
          ${themeColors.accent.coral} 20px,
          ${themeColors.accent.amber} 20px,
          ${themeColors.accent.amber} 30px,
          ${themeColors.primary.main} 30px,
          ${themeColors.primary.main} 40px
        )`;
      case 'gradient':
      default:
        return `linear-gradient(
          90deg,
          ${themeColors.accent.turquoise} 0%,
          ${themeColors.secondary.main} 25%,
          ${themeColors.accent.coral} 50%,
          ${themeColors.accent.amber} 75%,
          ${themeColors.primary.main} 100%
        )`;
    }
  };

  const borderStyle = {
    height: thickness,
    background: getBackground(),
    borderRadius: thickness / 2,
  };

  return (
    <Box>
      {(position === 'top' || position === 'both') && <Box sx={borderStyle} />}
      {position === 'both' && <Box sx={{ height: 16 }} />}
      {(position === 'bottom' || position === 'both') && <Box sx={borderStyle} />}
    </Box>
  );
};

