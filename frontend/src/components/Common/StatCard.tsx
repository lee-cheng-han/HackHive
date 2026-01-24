import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { themeColors } from '../../theme/theme';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  gradient = true,
  color = 'primary',
  trend,
}) => {
  const { translate } = useLanguage();
  const colorMap = {
    primary: {
      main: themeColors.primary.main,
      light: themeColors.primary.light,
      dark: themeColors.primary.dark,
    },
    secondary: {
      main: themeColors.secondary.main,
      light: themeColors.secondary.light,
      dark: themeColors.secondary.dark,
    },
    success: {
      main: themeColors.success.main,
      light: themeColors.success.light,
      dark: themeColors.success.dark,
    },
    warning: {
      main: themeColors.warning.main,
      light: themeColors.warning.light,
      dark: themeColors.warning.dark,
    },
    info: {
      main: themeColors.info.main,
      light: themeColors.info.light,
      dark: themeColors.info.dark,
    },
  };

  const colors = colorMap[color];

  return (
    <Card
      sx={{
        height: '100%',
        background: gradient
          ? `linear-gradient(135deg, ${colors.light} 0%, ${colors.main} 100%)`
          : colors.main,
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {label}
            </Typography>
            {trend && (
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mt: 0.5,
                  display: 'block',
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% {translate('dashboard.trendFromLastWeek')}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

