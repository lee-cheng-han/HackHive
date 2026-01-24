import React from 'react';
import { Box, Container, Typography, Paper, Card, CardContent } from '@mui/material';
import { TrendingUp, Book, Star } from '@mui/icons-material';

interface DashboardProps {
  userName?: string;
  stats?: {
    wordsLearned: number;
    storiesCompleted: number;
    currentStreak: number;
    level: string;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userName = 'Learner',
  stats = {
    wordsLearned: 45,
    storiesCompleted: 5,
    currentStreak: 7,
    level: 'Beginner'
  }
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {userName}!
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
        {/* Stats Cards */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Book color="primary" />
                <Box>
                  <Typography variant="h4">{stats.wordsLearned}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Words Learned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Book color="primary" />
                <Box>
                  <Typography variant="h4">{stats.storiesCompleted}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stories Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="primary" />
                <Box>
                  <Typography variant="h4">{stats.currentStreak}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Day Streak
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Star color="primary" />
                <Box>
                  <Typography variant="h4">{stats.level}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Level
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recommendations Section */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 calc(66.666% - 12px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommended for You
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on your progress, we recommend these stories and lessons...
            </Typography>
            {/* Recommendations will be populated from API */}
          </Paper>
        </Box>

        {/* Progress Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 12px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Learning Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Progress visualization will be added here
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

