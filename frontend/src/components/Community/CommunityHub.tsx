import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, Avatar } from '@mui/material';
import { People, Forum, AutoStoriesOutlined, TranslateOutlined, GroupOutlined, CalendarTodayOutlined } from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageExchangeSection } from './LanguageExchangeSection';
import { CulturalStoriesSection } from './CulturalStoriesSection';
import { CommunityForumsSection } from './CommunityForumsSection';
import { TranslationCollaborationSection } from './TranslationCollaborationSection';
import { CommunityEventsSection } from './CommunityEventsSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface CommunityHubProps {}

export const CommunityHub: React.FC<CommunityHubProps> = () => {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: themeColors.secondary.main, width: 48, height: 48 }}>
            <People />
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                color: themeColors.secondary.main
              }}
            >
              {translate('community.title') || 'Indigenous Language Community'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {translate('community.description') || 'Connect, learn, and preserve Indigenous languages together'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Community Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<GroupOutlined />} 
            iconPosition="start" 
            label="Language Exchange" 
          />
          <Tab 
            icon={<AutoStoriesOutlined />} 
            iconPosition="start" 
            label="Cultural Stories" 
          />
          <Tab 
            icon={<Forum />} 
            iconPosition="start" 
            label="Discussion Forums" 
          />
          <Tab 
            icon={<TranslateOutlined />} 
            iconPosition="start" 
            label="Translation Projects" 
          />
          <Tab 
            icon={<CalendarTodayOutlined />} 
            iconPosition="start" 
            label="Community Events" 
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <LanguageExchangeSection />
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <CulturalStoriesSection />
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        <CommunityForumsSection />
      </TabPanel>
      
      <TabPanel value={activeTab} index={3}>
        <TranslationCollaborationSection />
      </TabPanel>
      
      <TabPanel value={activeTab} index={4}>
        <CommunityEventsSection />
      </TabPanel>
    </Container>
  );
};

