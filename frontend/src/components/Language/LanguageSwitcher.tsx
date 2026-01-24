import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
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

  return (
    <FormControl size={size} sx={{ minWidth: 200 }}>
      <InputLabel sx={{ color: 'white' }}>Language</InputLabel>
      <Select
        value={language}
        label="Language"
        onChange={(e) => setLanguage(e.target.value as any)}
        sx={{
          color: 'white',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: themeColors.primary.main,
              '& .MuiMenuItem-root': {
                color: 'white',
                '&:hover': {
                  bgcolor: themeColors.primary.dark,
                },
                '&.Mui-selected': {
                  bgcolor: themeColors.primary.dark,
                },
              },
            },
          },
        }}
      >
        {supportedLanguages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
              <Box>
                <Box sx={{ fontWeight: 600 }}>{lang.nativeName}</Box>
                {lang.code !== 'en' && (
                  <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {lang.name}
                  </Box>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

