import React, { ReactNode } from 'react';
import { Card, CardProps, Box } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface PatternCardProps extends CardProps {
  children: ReactNode;
  pattern?: 'geometric' | 'wave' | 'dot' | 'none';
  accentColor?: string;
}

export const PatternCard: React.FC<PatternCardProps> = ({
  children,
  pattern = 'geometric',
  accentColor = themeColors.accent.turquoise,
  sx,
  ...props
}) => {
  const getPatternBackground = () => {
    switch (pattern) {
      case 'geometric':
        return `
          linear-gradient(135deg, ${accentColor}22 25%, transparent 25%),
          linear-gradient(225deg, ${accentColor}22 25%, transparent 25%),
          linear-gradient(45deg, ${accentColor}22 25%, transparent 25%),
          linear-gradient(315deg, ${accentColor}22 25%, transparent 25%)
        `;
      case 'wave':
        return `
          repeating-radial-gradient(
            circle at 0 0,
            transparent 0,
            ${accentColor}11 10px,
            transparent 20px
          )
        `;
      case 'dot':
        return `
          radial-gradient(circle, ${accentColor}33 1px, transparent 1px)
        `;
      default:
        return 'none';
    }
  };

  const getPatternBackgroundSize = () => {
    switch (pattern) {
      case 'geometric':
        return '40px 40px';
      case 'wave':
        return '100px 100px';
      case 'dot':
        return '20px 20px';
      default:
        return 'auto';
    }
  };

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {/* Pattern background layer */}
      {pattern !== 'none' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: getPatternBackground(),
            backgroundSize: getPatternBackgroundSize(),
            backgroundPosition: '0 0, 20px 0, 20px -20px, 0px 20px',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Card>
  );
};

