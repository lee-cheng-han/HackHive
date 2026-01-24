import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, Button, TextField, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Add, Favorite, Comment, Upload, People, MenuBook, Forum } from '@mui/icons-material';
import { Story } from '../../types/story';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommunityHubProps {
  stories?: Story[];
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ stories = [] }) => {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: themeColors.secondary.main, width: 48, height: 48 }}>
            <People />
          </Avatar>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: themeColors.secondary.main
            }}
          >
            {translate('community.title')}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {translate('community.description')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Upload />}
          onClick={() => setShowUploadForm(!showUploadForm)}
          sx={{
            bgcolor: themeColors.secondary.main,
            '&:hover': {
              bgcolor: themeColors.secondary.dark,
            }
          }}
        >
          {translate('community.shareStory')}
        </Button>
      </Box>

      {showUploadForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {translate('community.uploadStory')}
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={translate('community.storyTitle')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={translate('community.language')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={translate('community.storyText')}
              multiline
              rows={4}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" sx={{ mr: 1 }}>
                {translate('community.uploadAudio')}
              </Button>
              <Button variant="outlined" sx={{ mr: 1 }}>
                {translate('community.uploadImage')}
              </Button>
              <Button variant="contained" type="submit">
                {translate('community.submitForReview')}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label={translate('community.tab.stories')} />
          <Tab label={translate('community.tab.courses')} />
          <Tab label={translate('community.tab.discussions')} />
        </Tabs>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stories.map((story) => (
          <Card key={story.story_id}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {story.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {translate('community.language')}: {story.language} | {translate('community.level')}: {story.level}
              </Typography>
              <Box display="flex" gap={2} mt={2}>
                <Button size="small" startIcon={<Favorite />}>
                  {translate('community.like')}
                </Button>
                <Button size="small" startIcon={<Comment />}>
                  {translate('community.comment')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {stories.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {translate('community.noStories')}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

