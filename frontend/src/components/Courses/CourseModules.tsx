import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, Button, Chip, LinearProgress, Avatar } from '@mui/material';
import { PlayArrow, CheckCircle, School } from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';

interface Course {
  id: string;
  title: string;
  language: string;
  level: string;
  description: string;
  thumbnail?: string;
  progress?: number;
  completed?: boolean;
}

interface CourseModulesProps {
  courses?: Course[];
}

export const CourseModules: React.FC<CourseModulesProps> = ({ 
  courses = [
    {
      id: 'cree-basics',
      title: 'Plains Cree Basics',
      language: 'Cree',
      level: 'Beginner',
      description: 'Learn fundamental greetings, introductions, and common phrases in Plains Cree.',
      progress: 60,
      completed: false,
    },
    {
      id: 'ojibwe-family',
      title: 'Ojibwe Family Terms',
      language: 'Ojibwe',
      level: 'Beginner',
      description: 'Master vocabulary for family members and relationships.',
      progress: 100,
      completed: true,
    },
  ]
}) => {
  const { translate } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const languages = [
    { value: 'all', label: translate('courses.filter.all') },
    { value: 'Cree', label: translate('courses.filter.cree') },
    { value: 'Ojibwe', label: translate('courses.filter.ojibwe') },
    { value: 'Inuktitut', label: translate('courses.filter.inuktitut') },
    { value: 'Mohawk', label: translate('courses.filter.mohawk') },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: themeColors.primary.main, width: 48, height: 48 }}>
            <School />
          </Avatar>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: themeColors.primary.main
            }}
          >
            {translate('courses.title')}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" mb={3}>
          {translate('courses.description')}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5}>
          {languages.map((lang) => (
            <Chip
              key={lang.value}
              label={lang.label}
              onClick={() => setSelectedLanguage(lang.value)}
              sx={{
                bgcolor: selectedLanguage === lang.value 
                  ? themeColors.primary.main 
                  : 'transparent',
                color: selectedLanguage === lang.value 
                  ? 'white' 
                  : themeColors.text.primary,
                border: `2px solid ${selectedLanguage === lang.value ? themeColors.primary.main : themeColors.primary.light}`,
                fontWeight: selectedLanguage === lang.value ? 600 : 500,
                '&:hover': {
                  bgcolor: selectedLanguage === lang.value 
                    ? themeColors.primary.dark 
                    : themeColors.background.subtle,
                },
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {courses
          .filter(course => selectedLanguage === 'all' || course.language === selectedLanguage)
          .map((course) => (
            <Box 
              key={course.id}
              sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
                minWidth: 280,
                maxWidth: { md: 'calc(33.333% - 16px)' }
              }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                {course.thumbnail ? (
                  <Box
                    component="img"
                    sx={{ 
                      height: 180, 
                      width: '100%', 
                      objectFit: 'cover',
                      bgcolor: themeColors.background.subtle
                    }}
                    src={course.thumbnail}
                    alt={course.title}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      width: '100%',
                      bgcolor: themeColors.primary.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <School sx={{ fontSize: 64, color: 'white', opacity: 0.3 }} />
                  </Box>
                )}
                {course.completed && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: themeColors.success.main,
                      borderRadius: '50%',
                      p: 0.5,
                    }}
                  >
                    <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1.5}>
                    <Typography 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontWeight: 600,
                        color: themeColors.text.primary,
                        flex: 1
                      }}
                    >
                      {course.title}
                    </Typography>
                  </Box>
                  <Chip 
                    label={course.level === 'Beginner' 
                      ? translate('courses.level.beginner')
                      : course.level === 'Intermediate'
                      ? translate('courses.level.intermediate')
                      : translate('courses.level.advanced')} 
                    size="small" 
                    sx={{ 
                      mb: 1.5,
                      bgcolor: themeColors.accent.sage,
                      color: 'white',
                      fontWeight: 500
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {course.description}
                  </Typography>
                  {course.progress !== undefined && (
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {translate('courses.progress')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {course.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: themeColors.background.subtle,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: course.completed 
                              ? themeColors.success.main 
                              : themeColors.primary.main
                          }
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={course.completed ? <CheckCircle /> : <PlayArrow />}
                    sx={{
                      bgcolor: course.completed 
                        ? themeColors.success.main 
                        : themeColors.primary.main,
                      '&:hover': {
                        bgcolor: course.completed 
                          ? themeColors.success.dark 
                          : themeColors.primary.dark,
                      },
                      py: 1.25
                    }}
                  >
                    {course.completed ? translate('courses.reviewCourse') : translate('courses.continueLearning')}
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
      </Box>
    </Container>
  );
};

