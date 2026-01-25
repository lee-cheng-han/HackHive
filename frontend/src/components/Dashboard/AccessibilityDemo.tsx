import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  Slider,
  FormControlLabel,
  Chip,
  IconButton,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Accessibility,
  VolumeUp,
  Contrast,
  FormatSize,
  RecordVoiceOver,
  VisibilityOff,
  Keyboard,
  TouchApp,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';

export const AccessibilityDemo: React.FC = () => {
  const { translate } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 100,
    screenReader: false,
    audioAssist: false,
    focusIndicator: false,
  });

  const handleSettingChange = (setting: keyof typeof settings) => (value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: typeof value === 'object' ? value.target.checked : value
    }));
  };

  const getContainerStyle = () => ({
    transition: 'all 0.3s ease',
    ...(settings.highContrast && {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: '2px solid #FFFFFF',
    }),
    ...(settings.focusIndicator && {
      outline: '3px solid #FFD700',
      outlineOffset: '2px',
    }),
    fontSize: `${settings.fontSize}%`,
  });

  return (
    <Card 
      sx={{
        ...getContainerStyle(),
        mb: 4,
        background: settings.highContrast 
          ? '#000000' 
          : `linear-gradient(135deg, ${themeColors.background.paper}, ${themeColors.background.subtle})`,
        border: settings.highContrast 
          ? '2px solid #FFFFFF' 
          : `1px solid ${themeColors.accent.turquoise}33`,
        '&:hover': {
          borderColor: settings.highContrast ? '#FFD700' : themeColors.accent.turquoise,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Accessibility 
              sx={{ 
                color: settings.highContrast ? '#FFFFFF' : themeColors.primary.main, 
                fontSize: 32 
              }} 
            />
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: settings.highContrast ? '#FFFFFF' : 'inherit'
                }}
              >
                ᐚᐃᑲᐣ ᓀᐦᐃᔭᐍᐧᐃᐣ | Accessibility Features
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: settings.highContrast ? '#CCCCCC' : 'text.secondary'
                }}
              >
                Indigenous language learning for everyone
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label="DEMO"
              size="small"
              sx={{
                backgroundColor: settings.highContrast ? '#FFD700' : themeColors.accent.amber,
                color: settings.highContrast ? '#000000' : 'white',
                fontWeight: 700,
              }}
            />
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                color: settings.highContrast ? '#FFFFFF' : 'inherit'
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Quick Feature Preview */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
            icon={<Contrast />}
            label="ᒦᓇᐧᐨ ᐃᐧᒋᐦᐃᐍᐧᐃᐣ | High Contrast"
            variant={settings.highContrast ? "filled" : "outlined"}
            size="small"
            onClick={() => handleSettingChange('highContrast')(!settings.highContrast)}
            sx={{
              color: settings.highContrast ? '#000000' : 'inherit',
              backgroundColor: settings.highContrast ? '#FFFFFF' : 'inherit',
              borderColor: settings.highContrast ? '#FFFFFF' : 'inherit',
            }}
          />
          <Chip
            icon={<RecordVoiceOver />}
            label="ᐊᔮᐦᑵᒧᐧᐃᐣ | Audio Support"
            variant={settings.audioAssist ? "filled" : "outlined"}
            size="small"
            onClick={() => handleSettingChange('audioAssist')(!settings.audioAssist)}
            sx={{
              color: settings.highContrast ? '#000000' : 'inherit',
              backgroundColor: settings.audioAssist && settings.highContrast ? '#FFFFFF' : 'inherit',
            }}
          />
          <Chip
            icon={<FormatSize />}
            label="ᒥᓯᐍᐸᐃᒋᑲᓀᐧᐃᐣ | Large Text"
            variant={settings.fontSize > 100 ? "filled" : "outlined"}
            size="small"
            sx={{
              color: settings.highContrast ? '#000000' : 'inherit',
              backgroundColor: settings.fontSize > 100 && settings.highContrast ? '#FFFFFF' : 'inherit',
            }}
          />
        </Box>

        {settings.audioAssist && (
          <Alert 
            icon={<VolumeUp />}
            severity="info" 
            sx={{ 
              mb: 2,
              backgroundColor: settings.highContrast ? '#333333' : 'inherit',
              color: settings.highContrast ? '#FFFFFF' : 'inherit',
              '& .MuiAlert-icon': {
                color: settings.highContrast ? '#FFD700' : 'inherit',
              }
            }}
          >
            <Typography variant="body2">
              ᓂᐸᓀ ᐊᔮᐦᑵᒧᐧᐃᐣ | Audio assistance is now active
            </Typography>
          </Alert>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: settings.highContrast ? '#333333' : 'divider' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: settings.highContrast ? '#FFFFFF' : 'inherit'
              }}
            >
              ᐚᐃᑲᐣ ᐱᑯᓀᐧᐃᐣ | Accessibility Controls
            </Typography>
            
            {/* Controls Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* Visual Controls */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: settings.highContrast ? '#FFD700' : themeColors.primary.main
                  }}
                >
                  <VisibilityOff sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Visual Accessibility
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.highContrast}
                        onChange={handleSettingChange('highContrast')}
                        sx={{
                          '& .MuiSwitch-thumb': {
                            backgroundColor: settings.highContrast ? '#FFD700' : 'inherit',
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: settings.highContrast ? '#FFFFFF' : 'inherit' }}>
                        ᒦᓇᐧᐨ ᐃᐧᒋᐦᐃᐍᐧᐃᐣ | High Contrast
                      </Typography>
                    }
                  />
                  
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        color: settings.highContrast ? '#FFFFFF' : 'inherit'
                      }}
                    >
                      ᒥᓯᐍᐸᐃᒋᑲᓀᐧᐃᐣ | Font Size: {settings.fontSize}%
                    </Typography>
                    <Slider
                      value={settings.fontSize}
                      onChange={(_, value) => handleSettingChange('fontSize')(value)}
                      min={75}
                      max={150}
                      step={25}
                      marks={[
                        { value: 75, label: '75%' },
                        { value: 100, label: '100%' },
                        { value: 125, label: '125%' },
                        { value: 150, label: '150%' },
                      ]}
                      sx={{
                        color: settings.highContrast ? '#FFD700' : themeColors.primary.main,
                        '& .MuiSlider-markLabel': {
                          color: settings.highContrast ? '#FFFFFF' : 'inherit',
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Audio & Navigation Controls */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: settings.highContrast ? '#FFD700' : themeColors.primary.main
                  }}
                >
                  <VolumeUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Audio & Navigation
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.screenReader}
                        onChange={handleSettingChange('screenReader')}
                      />
                    }
                    label={
                      <Typography sx={{ color: settings.highContrast ? '#FFFFFF' : 'inherit' }}>
                        <RecordVoiceOver sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                        ᐊᔮᐦᑵᒧᐧᐃᐣ | Screen Reader
                      </Typography>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.audioAssist}
                        onChange={handleSettingChange('audioAssist')}
                      />
                    }
                    label={
                      <Typography sx={{ color: settings.highContrast ? '#FFFFFF' : 'inherit' }}>
                        <VolumeUp sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                        ᓂᐸᓀ ᐊᔮᐦᑵᒧᐧᐃᐣ | Audio Cues
                      </Typography>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.focusIndicator}
                        onChange={handleSettingChange('focusIndicator')}
                      />
                    }
                    label={
                      <Typography sx={{ color: settings.highContrast ? '#FFFFFF' : 'inherit' }}>
                        <TouchApp sx={{ mr: 1, verticalAlign: 'middle', fontSize: 18 }} />
                        ᐚᐸᐦᑕᒼ | Focus Indicators
                      </Typography>
                    }
                  />
                </Box>
              </Box>
            </Box>

            {/* Demo Actions */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: settings.highContrast ? '#333333' : 'divider' }}>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<Keyboard />}
                  sx={{
                    backgroundColor: settings.highContrast ? '#FFD700' : themeColors.primary.main,
                    color: settings.highContrast ? '#000000' : 'white',
                    '&:hover': {
                      backgroundColor: settings.highContrast ? '#FFA500' : themeColors.primary.dark,
                    }
                  }}
                >
                  ᑭᐢᑭᓀᐧᐃᐣ | Keyboard Navigation
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RecordVoiceOver />}
                  sx={{
                    borderColor: settings.highContrast ? '#FFFFFF' : themeColors.primary.main,
                    color: settings.highContrast ? '#FFFFFF' : themeColors.primary.main,
                    '&:hover': {
                      borderColor: settings.highContrast ? '#FFD700' : themeColors.primary.dark,
                      backgroundColor: settings.highContrast ? 'rgba(255, 215, 0, 0.1)' : 'inherit',
                    }
                  }}
                >
                  ᐊᔮᐦᑵᒧᐧᐃᐣ | Voice Commands
                </Button>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};