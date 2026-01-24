import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { MainNavigation } from './components/Navigation/MainNavigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CourseModules } from './components/Courses/CourseModules';
import { CommunityHub } from './components/Community/CommunityHub';
import { Settings } from './components/Settings/Settings';
import { Story } from './types/story';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

// Mock story data for testing
const mockStory: Story = {
  story_id: 'test-story',
  language: 'cr',
  title: 'The Morning Song',
  level: 'beginner',
  scenes: [
    {
      id: 'scene1',
      order: 1,
      text: 'Tānisi! My name is Miyo.',
      text_translation: 'Hello! My name is Miyo.',
      interaction_type: 'choice',
      choices: [
        {
          id: 'choice1',
          text: 'Hello!',
          text_translation: 'Hello!',
          next_scene: 'scene2',
        },
        {
          id: 'choice2',
          text: 'Who are you?',
          text_translation: 'Who are you?',
          next_scene: 'scene3',
        },
      ],
    },
  ],
};

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return <Dashboard />;
      case 1:
        return <CourseModules />;
      case 2:
        return <CommunityHub stories={[mockStory]} />;
      case 3:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <MainNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        <Box sx={{ flexGrow: 1 }}>
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
