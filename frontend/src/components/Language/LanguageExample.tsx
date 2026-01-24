import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { TranslationDisplay } from './TranslationDisplay';
import { BilingualText } from './BilingualText';
import { themeColors } from '../../theme/theme';

/**
 * Example component demonstrating language features
 */
export const LanguageExample: React.FC = () => {
  const { language, translate, getLanguageName } = useLanguage();

  // Example texts in different languages
  const examples = {
    cr: {
      text: 'Tānisi! Niya Miyo nitisiyihkāson.',
      translation: 'Hello! My name is Miyo.',
    },
    oj: {
      text: 'Aaniin! Niin Miyo nindizhinikaaz.',
      translation: 'Hello! My name is Miyo.',
    },
    iu: {
      text: 'ᐊᐃᓐᖓᐃ! ᐊᑎᒃ ᐊᒻᒪ ᐊᐃᓐᖓᐃ.',
      translation: 'Hello! My name is Ataata.',
    },
  };

  const currentExample = examples[language as keyof typeof examples] || examples.cr;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Language Features Demo
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Language Switcher
        </Typography>
        <LanguageSwitcher />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current Language: <strong>{language}</strong>
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Translation Display
            </Typography>
            <TranslationDisplay
              text={currentExample.text}
              translation={currentExample.translation}
              language={language}
              showTranslation={true}
              onPlayAudio={() => console.log('Play audio')}
            />
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bilingual Text
            </Typography>
            <BilingualText
              primaryText={currentExample.text}
              secondaryText={currentExample.translation}
              primaryLanguage={language}
              secondaryLanguage="en"
              showToggle={true}
            />
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Translation Examples
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(examples).map(([lang, example]) => (
            <TranslationDisplay
              key={lang}
              text={example.text}
              translation={example.translation}
              language={lang}
              showTranslation={true}
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

