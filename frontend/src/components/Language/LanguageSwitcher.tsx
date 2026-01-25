import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Fade,
} from '@mui/material';
import { ExpandMore, Language } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { themeColors } from '../../theme/theme';

interface LanguageSwitcherProps {
  size?: 'small' | 'medium';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  size = 'small',
}) => {
  const {
    language,
    setLanguage,
    supportedLanguages,
  } = useLanguage();
  
  const { playClickSound, announceText } = useAccessibility();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    playClickSound();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    const selectedLang = supportedLanguages.find(lang => lang.code === langCode);
    setLanguage(langCode as any);
    handleClose();
    playClickSound();
    announceText(`Language changed to ${selectedLang?.name || langCode}`);
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<ExpandMore />}
        sx={{
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          px: 2.5,
          py: 1,
          minWidth: 'auto',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiButton-endIcon': {
            ml: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Language sx={{ fontSize: 20 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="caption" sx={{ lineHeight: 1, fontSize: '0.7rem', opacity: 0.8 }}>
              ᐊᔮᐦᑵᒣᐤ
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: 700 }}>
              {currentLanguage?.nativeName || 'ᓀᐦᐃᔭᐍᐧᐃᐣ'}
            </Typography>
          </Box>
        </Box>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            borderRadius: 3,
            minWidth: 280,
            background: `linear-gradient(135deg, ${themeColors.background.paper}, ${themeColors.background.subtle})`,
            border: `1px solid ${themeColors.accent.turquoise}33`,
            '& .MuiMenuItem-root': {
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              px: 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: `${themeColors.primary.main}15`,
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease',
              },
              '&.Mui-selected': {
                backgroundColor: `${themeColors.primary.main}25`,
                borderLeft: `3px solid ${themeColors.primary.main}`,
                '&:hover': {
                  backgroundColor: `${themeColors.primary.main}35`,
                },
              },
            },
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              px: 2, 
              py: 1, 
              color: themeColors.text.secondary,
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            ᓀᐦᐃᔭᐍᐧᐃᐣ ᓀᐦᐃᔭᐍᐤ | Select Language
          </Typography>
        </Box>
        
        {supportedLanguages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            selected={language === lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box 
                sx={{ 
                  fontSize: '1.5em',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: language === lang.code ? themeColors.primary.main : 'transparent',
                }}
              >
                {lang.flag}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {lang.nativeName}
                </Typography>
                {lang.code !== 'en' && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: themeColors.text.secondary, 
                      fontSize: '0.75rem',
                      lineHeight: 1 
                    }}
                  >
                    {lang.name}
                  </Typography>
                )}
              </Box>
              {language === lang.code && (
                <Chip 
                  label="ᐊᓂᑲ"
                  size="small"
                  sx={{ 
                    backgroundColor: themeColors.primary.main,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

