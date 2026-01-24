import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface ProgressRingProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 120,
  thickness = 4,
  label,
  showValue = true,
  color = 'primary',
}) => {
  const colorMap = {
    primary: themeColors.primary.main,
    success: themeColors.success.main,
    warning: themeColors.warning.main,
    error: themeColors.error.main,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{
          color: colorMap[color],
          position: 'absolute',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {showValue && (
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: themeColors.text.primary,
            }}
          >
            {Math.round(value)}%
          </Typography>
        )}
        {label && (
          <Typography
            variant="caption"
            sx={{
              color: themeColors.text.secondary,
              mt: 0.5,
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

