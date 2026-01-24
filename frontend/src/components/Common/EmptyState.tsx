import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box
          sx={{
            fontSize: 64,
            mb: 2,
            opacity: 0.5,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: themeColors.text.primary,
          mb: 1,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 400, mb: 3 }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            bgcolor: themeColors.primary.main,
            '&:hover': {
              bgcolor: themeColors.primary.dark,
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

