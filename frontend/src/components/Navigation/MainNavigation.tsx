import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Avatar } from '@mui/material';
import { Dashboard, Book, People, Settings } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../Language/LanguageSwitcher';
import { themeColors } from '../../theme/theme';

interface MainNavigationProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ currentTab, onTabChange }) => {
  const { translate } = useLanguage();

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
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mr: 1.5,
              width: 40,
              height: 40
            }}
          >
            🐢
          </Avatar>
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
            onChange={(_, newValue) => onTabChange(newValue)}
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
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

