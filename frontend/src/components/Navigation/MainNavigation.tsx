import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Avatar } from '@mui/material';
import { Dashboard, Book, People, Settings } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { LanguageSwitcher } from '../Language/LanguageSwitcher';
import { AccessibilitySettings } from './AccessibilitySettings';
import { themeColors } from '../../theme/theme';

interface MainNavigationProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ currentTab, onTabChange }) => {
  const { translate } = useLanguage();
  const { playClickSound, announceText } = useAccessibility();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    playClickSound();
    onTabChange(newValue);
    
    // Announce tab change for screen readers
    const tabNames = ['Dashboard', 'Courses', 'Community', 'Settings'];
    announceText(`Switched to ${tabNames[newValue]} tab`);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Box
            component="img"
            src="/turtletalk-logo.png"
            alt="TurtleTalk Logo"
            sx={{
              width: 40,
              height: 40,
              mr: 1.5,
            }}
          />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            TurtleTalk
          </Typography>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              display: { xs: 'block', sm: 'none' }
            }}
          >
            TT
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: themeColors.secondary.light,
                height: 3,
              },
            }}
          >
            <Tab 
              icon={<Dashboard />} 
              label={translate('nav.dashboard')}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<Book />} 
              label={translate('nav.courses')}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<People />} 
              label={translate('nav.community')}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab 
              icon={<Settings />} 
              label={translate('nav.settings')}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <AccessibilitySettings />
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

