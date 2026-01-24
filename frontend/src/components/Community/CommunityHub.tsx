import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, Button, TextField, Card, CardContent } from '@mui/material';
import { Add, Favorite, Comment, Upload } from '@mui/icons-material';
import { Story } from '../../types/story';

interface CommunityHubProps {
  stories?: Story[];
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ stories = [] }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Community Hub
        </Typography>
        <Button
          variant="contained"
          startIcon={<Upload />}
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          Share Your Story
        </Button>
      </Box>

      {showUploadForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload a Story or Course
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Story Title"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Language"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Story Text"
              multiline
              rows={4}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" sx={{ mr: 1 }}>
                Upload Audio
              </Button>
              <Button variant="outlined" sx={{ mr: 1 }}>
                Upload Image
              </Button>
              <Button variant="contained" type="submit">
                Submit for Review
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Stories" />
          <Tab label="Courses" />
          <Tab label="Discussions" />
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
                Language: {story.language} | Level: {story.level}
              </Typography>
              <Box display="flex" gap={2} mt={2}>
                <Button size="small" startIcon={<Favorite />}>
                  Like
                </Button>
                <Button size="small" startIcon={<Comment />}>
                  Comment
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {stories.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No community stories yet. Be the first to share!
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

