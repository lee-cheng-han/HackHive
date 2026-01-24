import React from 'react';
import { Typography, TypographyProps, SxProps, Theme } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface GradientTextProps extends Omit<TypographyProps, 'sx'> {
  gradient?: 'primary' | 'secondary' | 'sunset' | 'nature';
  sx?: SxProps<Theme>;
}

export const GradientText: React.FC<GradientTextProps> = ({
  gradient = 'primary',
  sx,
  children,
  ...props
}) => {
  const gradients = {
    primary: `linear-gradient(135deg, ${themeColors.primary.dark}, ${themeColors.primary.light}, ${themeColors.accent.coral})`,
    secondary: `linear-gradient(135deg, ${themeColors.secondary.dark}, ${themeColors.secondary.main}, ${themeColors.accent.turquoise})`,
    sunset: `linear-gradient(135deg, ${themeColors.accent.deep_red}, ${themeColors.accent.coral}, ${themeColors.accent.amber})`,
    nature: `linear-gradient(135deg, ${themeColors.accent.forest}, ${themeColors.accent.sage}, ${themeColors.accent.turquoise})`,
  };

  return (
    <Typography
      {...props}
      sx={{
        background: gradients[gradient],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

