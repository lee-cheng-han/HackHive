import React from 'react';
import { Box, Container, Typography, LinearProgress, Card, CardContent, Chip } from '@mui/material';
import { TrendingUp, Book, EmojiEvents, Star, AutoStories, Whatshot } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatCard, DecorativeBorder, GradientText, PatternCard } from '../Common';
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
      {/* Hero Section with Decorative Border */}
      <Box sx={{ mb: 4, className: 'fade-in' }}>
        <DecorativeBorder position="top" variant="gradient" thickness={4} />
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${themeColors.primary.dark}, ${themeColors.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {translate('dashboard.welcome')}, {userName}! 🦬
          </Typography>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            color: themeColors.text.secondary,
            fontWeight: 400,
            mt: 1
          }}
        >
          {translate('dashboard.continueJourney')}
        </Typography>
        <DecorativeBorder position="bottom" variant="geometric" thickness={3} />
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
          <PatternCard pattern="geometric" accentColor={themeColors.accent.turquoise} elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Star sx={{ color: themeColors.accent.amber, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {translate('dashboard.recommended')}
                </Typography>
                <Chip 
                  label="NEW" 
                  size="small" 
                  sx={{ 
                    ml: 'auto',
                    background: `linear-gradient(135deg, ${themeColors.accent.coral}, ${themeColors.accent.amber})`,
                    color: 'white',
                    fontWeight: 700
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                {translate('dashboard.recommendationsDescription')}
              </Typography>
              
              {/* Sample recommendation cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${themeColors.background.paper}, ${themeColors.background.subtle})`,
                    border: `2px solid ${themeColors.accent.turquoise}33`,
                    '&:hover': {
                      borderColor: themeColors.accent.turquoise,
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <AutoStories sx={{ color: themeColors.accent.turquoise, fontSize: 32 }} />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          ᑕᐃᐧᓇ - ᑮᐢᑳᐤ ᓂᑲᒧᐣ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ᓇᑲᒧᐣ · 5 ᐊᓱᓀᐤ · ᓀᐦᐃᔭᐍᐧᐃᐣ
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card 
                  sx={{ 
                    background: `linear-gradient(135deg, ${themeColors.background.paper}, ${themeColors.background.subtle})`,
                    border: `2px solid ${themeColors.accent.coral}33`,
                    '&:hover': {
                      borderColor: themeColors.accent.coral,
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Whatshot sx={{ color: themeColors.accent.coral, fontSize: 32 }} />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          ᓂᑐᓇᐍᐤ - ᐚᐢᑲᐦᐃᑲᐣ ᐊᔮᐦᑵᒣᐤ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ᓇᑲᒧᐣ · 15 ᐊᓱᓀᐤ · ᐸᐱᒋ ᑭᐢᑭᓀᐤ
                        </Typography>
                      </Box>
                      <Chip 
                        label="🔥" 
                        size="small" 
                        sx={{ bgcolor: themeColors.accent.amber + '20' }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </CardContent>
          </PatternCard>
        </Box>

        {/* Progress Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 12px)' } }}>
          <PatternCard pattern="wave" accentColor={themeColors.secondary.main} elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <TrendingUp sx={{ color: themeColors.secondary.main, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {translate('dashboard.progress')}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={1}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {translate('dashboard.thisWeek')}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.accent.turquoise})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    65%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    bgcolor: themeColors.background.subtle,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: `linear-gradient(90deg, ${themeColors.accent.turquoise}, ${themeColors.secondary.main}, ${themeColors.accent.purple})`
                    }
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                  {translate('dashboard.weeklyGoal')}
                </Typography>
              </Box>
              
              {/* Mini achievement badges */}
              <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${themeColors.background.subtle}` }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  ᐅᐢᑫᔦᐃᐧ ᐚᐱᑎᓯᐤ
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Box 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${themeColors.accent.amber}, ${themeColors.accent.coral})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    🏆
                  </Box>
                  <Box 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${themeColors.success.main}, ${themeColors.accent.sage})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    ⭐
                  </Box>
                  <Box 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${themeColors.accent.turquoise}, ${themeColors.secondary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    🎯
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </PatternCard>
        </Box>
      </Box>
    </Container>
  );
};


