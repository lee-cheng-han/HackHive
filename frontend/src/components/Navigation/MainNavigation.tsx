import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import { Dashboard, Book, People, Settings } from '@mui/icons-material';

interface MainNavigationProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          TurtleTalk
        </Typography>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab icon={<Dashboard />} label="Dashboard" iconPosition="start" />
          <Tab icon={<Book />} label="Courses" iconPosition="start" />
          <Tab icon={<People />} label="Community" iconPosition="start" />
          <Tab icon={<Settings />} label="Settings" iconPosition="start" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

