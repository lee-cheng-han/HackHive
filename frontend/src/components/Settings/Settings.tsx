import React from 'react';
import { Box, Container, Typography, Paper, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Button, Avatar, Divider } from '@mui/material';
import { Settings as SettingsIcon, Language, Accessibility, AccountCircle, PrivacyTip } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../Language/LanguageSwitcher';
import { FontSizeControl } from '../Accessibility/FontSizeControl';
import { HighContrastToggle } from '../Accessibility/HighContrastToggle';
import { themeColors } from '../../theme/theme';

export const Settings: React.FC = () => {
  const { translate, language } = useLanguage();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: themeColors.primary.main, width: 48, height: 48 }}>
            <SettingsIcon />
          </Avatar>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: themeColors.primary.main
            }}
          >
            {translate('settings.title')}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {translate('settings.customizeExperience')}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Language sx={{ color: themeColors.secondary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {translate('settings.language')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {translate('settings.chooseLanguage')}
          </Typography>
          <LanguageSwitcher size="medium" />
        </Box>
        {language !== 'en' && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{translate('settings.dialect')}</InputLabel>
            <Select defaultValue="plains" label={translate('settings.dialect')}>
              <MenuItem value="plains">Plains Cree</MenuItem>
              <MenuItem value="swampy">Swampy Cree</MenuItem>
              <MenuItem value="woodland">Woodland Cree</MenuItem>
            </Select>
          </FormControl>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Accessibility sx={{ color: themeColors.accent.forest }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {translate('settings.accessibility')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              {translate('settings.fontSize')}
            </Typography>
            <FontSizeControl />
          </Box>
          <Box sx={{ mb: 2 }}>
            <HighContrastToggle />
          </Box>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={translate('settings.enableSubtitles')}
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={translate('settings.voiceInputEnabled')}
          />
          <FormControlLabel
            control={<Switch />}
            label={translate('settings.kidsMode')}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <AccountCircle sx={{ color: themeColors.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {translate('settings.account')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" sx={{ mr: 2 }}>
            {translate('settings.changePassword')}
          </Button>
          <Button variant="outlined" sx={{ mr: 2 }}>
            {translate('settings.editProfile')}
          </Button>
          <Button variant="outlined" color="error">
            {translate('settings.deleteAccount')}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <PrivacyTip sx={{ color: themeColors.secondary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {translate('settings.privacy')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={translate('settings.allowDataCollection')}
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {translate('settings.dataCollectionDescription')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

