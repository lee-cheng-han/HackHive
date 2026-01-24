import React from 'react';
import { Box, Container, Typography, Paper, LinearProgress } from '@mui/material';
import { TrendingUp, Book, EmojiEvents, Star } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatCard } from '../Common/StatCard';
import { themeColors } from '../../theme/theme';

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
  const { translate, language } = useLanguage();
  
  // Translate level value
  const translatedLevel = stats.level === 'Beginner' 
    ? translate('dashboard.level.beginner')
    : stats.level === 'Intermediate'
    ? translate('dashboard.level.intermediate')
    : translate('dashboard.level.advanced');

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: themeColors.primary.main,
            mb: 1
          }}
        >
          {translate('dashboard.welcome')}, {userName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {translate('dashboard.continueJourney')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Stats Cards */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <StatCard
            icon={<Book sx={{ color: 'white', fontSize: 28 }} />}
            value={stats.wordsLearned}
            label={translate('dashboard.wordsLearned')}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <StatCard
            icon={<Book sx={{ color: 'white', fontSize: 28 }} />}
            value={stats.storiesCompleted}
            label={translate('dashboard.storiesCompleted')}
            color="secondary"
          />
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <StatCard
            icon={<TrendingUp sx={{ color: 'white', fontSize: 28 }} />}
            value={stats.currentStreak}
            label={`${translate('dashboard.dayStreak')} 🔥`}
            color="warning"
          />
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 200 }}>
          <StatCard
            icon={<EmojiEvents sx={{ color: 'white', fontSize: 28 }} />}
            value={translatedLevel}
            label={translate('dashboard.currentLevel')}
            color="success"
          />
        </Box>

        {/* Recommendations Section */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 calc(66.666% - 12px)' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Star sx={{ color: themeColors.accent.sunset }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {translate('dashboard.recommended')}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {translate('dashboard.recommendationsDescription')}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Placeholder for recommendations list */}
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: themeColors.background.subtle, 
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {translate('dashboard.recommendationsPlaceholder')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Progress Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 12px)' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingUp sx={{ color: themeColors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {translate('dashboard.progress')}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {translate('dashboard.thisWeek')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={65} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: themeColors.background.subtle,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: themeColors.primary.main
                  }
                }} 
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                65% {translate('dashboard.weeklyGoal')}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};


