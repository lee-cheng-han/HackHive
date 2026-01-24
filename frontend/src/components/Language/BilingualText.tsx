import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { themeColors } from '../../theme/theme';

interface BilingualTextProps {
  primaryText: string;
  secondaryText?: string;
  primaryLanguage: string;
  secondaryLanguage?: string;
  showToggle?: boolean;
  defaultExpanded?: boolean;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  primaryText,
  secondaryText,
  primaryLanguage,
  secondaryLanguage = 'en',
  showToggle = true,
  defaultExpanded = false,
}) => {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Determine which text to show as primary based on current language
  const isPrimaryLanguage = primaryLanguage === language;
  const displayPrimary = isPrimaryLanguage ? primaryText : secondaryText || primaryText;
  const displaySecondary = isPrimaryLanguage ? secondaryText : primaryText;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
        <Typography
          variant="body1"
          sx={{
            flex: 1,
            color: themeColors.text.primary,
            lineHeight: 1.6,
          }}
        >
          {displayPrimary}
        </Typography>
        {showToggle && displaySecondary && (
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: themeColors.primary.main,
              mt: -0.5,
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {displaySecondary && (
        <Collapse in={expanded || !showToggle}>
          <Box
            sx={{
              mt: 1,
              pl: 2,
              borderLeft: `3px solid ${themeColors.primary.light}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: themeColors.text.secondary,
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              {displaySecondary}
            </Typography>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

