import React, { ReactNode } from 'react';
import { Box, Avatar } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface IconBadgeProps {
  icon: ReactNode;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent' | 'success';
  glow?: boolean;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  size = 'medium',
  color = 'primary',
  glow = false,
}) => {
  const sizes = {
    small: 48,
    medium: 64,
    large: 80,
  };

  const colors = {
    primary: {
      background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.light})`,
      shadow: themeColors.primary.main,
    },
    secondary: {
      background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.light})`,
      shadow: themeColors.secondary.main,
    },
    accent: {
      background: `linear-gradient(135deg, ${themeColors.accent.turquoise}, ${themeColors.accent.coral})`,
      shadow: themeColors.accent.turquoise,
    },
    success: {
      background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.success.light})`,
      shadow: themeColors.success.main,
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
      }}
    >
      <Avatar
        sx={{
          width: sizes[size],
          height: sizes[size],
          background: colors[color].background,
          boxShadow: glow ? `0 0 20px ${colors[color].shadow}40, 0 4px 12px ${colors[color].shadow}20` : 'none',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 0 24px ${colors[color].shadow}60, 0 6px 16px ${colors[color].shadow}30`,
          },
        }}
      >
        {icon}
      </Avatar>
    </Box>
  );
};

