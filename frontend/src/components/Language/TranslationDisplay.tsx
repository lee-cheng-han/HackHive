import React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { Translate, VolumeUp } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { themeColors } from '../../theme/theme';

interface TranslationDisplayProps {
  text: string;
  translation?: string;
  language: string;
  showTranslation?: boolean;
  onPlayAudio?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  text,
  translation,
  language: displayLanguage,
  showTranslation = true,
  onPlayAudio,
  size = 'medium',
}) => {
  const { getLanguageName } = useLanguage();

  const sizeStyles = {
    small: { fontSize: '0.875rem' },
    medium: { fontSize: '1rem' },
    large: { fontSize: '1.25rem' },
  };

  const isIndigenousLanguage = !['en', 'fr'].includes(displayLanguage);

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: isIndigenousLanguage
          ? themeColors.background.subtle
          : themeColors.background.paper,
        border: `1px solid ${themeColors.primary.light}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: showTranslation ? 1 : 0 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Translate sx={{ fontSize: 18, color: themeColors.primary.main }} />
            <Typography
              variant="caption"
              sx={{
                color: themeColors.text.secondary,
                fontWeight: 500,
              }}
            >
              {getLanguageName(displayLanguage as any) || displayLanguage}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              ...sizeStyles[size],
              fontWeight: isIndigenousLanguage ? 600 : 400,
              color: themeColors.text.primary,
              lineHeight: 1.6,
            }}
          >
            {text}
          </Typography>
        </Box>
        {onPlayAudio && (
          <Tooltip title="Play audio">
            <IconButton
              size="small"
              onClick={onPlayAudio}
              sx={{
                color: themeColors.primary.main,
                '&:hover': {
                  bgcolor: themeColors.background.subtle,
                },
              }}
            >
              <VolumeUp fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {showTranslation && translation && (
        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px dashed ${themeColors.primary.light}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: themeColors.text.secondary,
              fontWeight: 500,
              mb: 0.5,
              display: 'block',
            }}
          >
            Translation (English):
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: themeColors.text.secondary,
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            {translation}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

