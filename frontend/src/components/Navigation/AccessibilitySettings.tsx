import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Fade,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  Accessibility,
  Contrast,
  FormatSize,
  VolumeUp,
  RecordVoiceOver,
  Keyboard,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const AccessibilitySettings: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { settings, updateSettings, playClickSound, announceText } = useAccessibility();
  
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    playClickSound();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingChange = (setting: keyof typeof settings) => (value: any) => {
    const newValue = typeof value === 'object' ? value.target.checked : value;
    updateSettings({ [setting]: newValue });
    playClickSound();
  };

  const testAudioFeedback = () => {
    playClickSound();
    announceText('Audio feedback is working. You can hear clicks and screen reader announcements.');
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          width: 40,
          height: 40,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
        aria-label="Accessibility Settings"
      >
        <Accessibility />
      </IconButton>
      
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
            minWidth: 350,
            maxWidth: 400,
            background: `linear-gradient(135deg, ${themeColors.background.paper}, ${themeColors.background.subtle})`,
            border: `1px solid ${themeColors.accent.turquoise}33`,
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700,
              color: themeColors.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Accessibility />
            ᐚᐃᑲᐣ ᐱᑯᓀᐧᐃᐣ | Accessibility
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Customize your learning experience • Changes apply immediately
          </Typography>
        </Box>
        
        <Divider sx={{ mx: 2 }} />
        
        {/* Live Demo Alert */}
        {(settings.audioFeedback || settings.fontSize !== 100) && (
          <Box sx={{ p: 2, pb: 0 }}>
            <Alert 
              severity="info" 
              sx={{ 
                fontSize: '0.8rem',
                '& .MuiAlert-icon': { fontSize: 16 }
              }}
            >
              Live accessibility features are active!
            </Alert>
          </Box>
        )}
        
        {/* Visual Settings */}
        <Box sx={{ p: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              color: themeColors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FormatSize sx={{ fontSize: 16 }} />
            Visual Settings
          </Typography>
          
          <Box sx={{ ml: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={handleSettingChange('highContrast')}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  High Contrast Mode
                </Typography>
              }
            />
            
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1 }}>
                Font Size: {settings.fontSize}%
              </Typography>
              <Slider
                value={settings.fontSize}
                onChange={(_, value) => handleSettingChange('fontSize')(value)}
                min={75}
                max={150}
                step={25}
                size="small"
                marks={[
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                  { value: 150, label: '150%' },
                ]}
                sx={{
                  color: themeColors.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                  },
                  '& .MuiSlider-markLabel': {
                    fontSize: '0.7rem',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mx: 2 }} />
        
        {/* Audio Settings */}
        <Box sx={{ p: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              color: themeColors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <VolumeUp sx={{ fontSize: 16 }} />
            Audio & Navigation
          </Typography>
          
          <Box sx={{ ml: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.screenReader}
                    onChange={handleSettingChange('screenReader')}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Screen Reader Support
                  </Typography>
                }
              />
              {settings.screenReader && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', mt: 0.5 }}>
                  Text will be read aloud when you interact with elements
                </Typography>
              )}
            </Box>
            
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.audioFeedback}
                    onChange={handleSettingChange('audioFeedback')}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Audio Click Feedback
                  </Typography>
                }
              />
              {settings.audioFeedback && (
                <Button
                  size="small"
                  startIcon={<VolumeUp />}
                  onClick={testAudioFeedback}
                  sx={{ ml: 4, mt: 0.5, fontSize: '0.7rem' }}
                >
                  Test Audio
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mx: 2 }} />
        
        {/* Quick Actions */}
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1,
            }}
          >
            <Keyboard sx={{ fontSize: 12 }} />
            Press Tab to navigate • Spacebar to activate • Try clicking around!
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
};