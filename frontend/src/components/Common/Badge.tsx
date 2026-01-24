import React from 'react';
import { Box, Typography } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'error' | 'default';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  icon,
}) => {
  const variantColors = {
    primary: themeColors.primary.main,
    success: themeColors.success.main,
    warning: themeColors.warning.main,
    info: themeColors.secondary.main,
    error: themeColors.error.main,
    default: themeColors.text.secondary,
  };

  const sizeStyles = {
    small: { px: 1, py: 0.5, fontSize: '0.75rem' },
    medium: { px: 1.5, py: 0.75, fontSize: '0.875rem' },
    large: { px: 2, py: 1, fontSize: '1rem' },
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: variantColors[variant],
        color: 'white',
        borderRadius: 2,
        fontWeight: 600,
        ...sizeStyles[size],
      }}
    >
      {icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: 'white',
          fontSize: sizeStyles[size].fontSize,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

