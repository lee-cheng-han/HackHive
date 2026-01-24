import React from 'react';
import { Avatar, Box } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface AvatarWithBadgeProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  size?: number;
  badge?: React.ReactNode;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  online?: boolean;
}

export const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  src,
  alt,
  children,
  size = 40,
  badge,
  badgePosition = 'bottom-right',
  online,
}) => {
  const positionMap = {
    'top-right': { top: 0, right: 0 },
    'top-left': { top: 0, left: 0 },
    'bottom-right': { bottom: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
      }}
    >
      <Avatar
        src={src}
        alt={alt}
        sx={{
          width: size,
          height: size,
          bgcolor: themeColors.primary.main,
        }}
      >
        {children}
      </Avatar>
      {online && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            bgcolor: themeColors.success.main,
            border: `2px solid white`,
            borderRadius: '50%',
          }}
        />
      )}
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            ...positionMap[badgePosition],
            transform: 'translate(25%, 25%)',
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
};

