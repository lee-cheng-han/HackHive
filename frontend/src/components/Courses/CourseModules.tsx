import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, Button, Chip } from '@mui/material';
import { PlayArrow, CheckCircle } from '@mui/icons-material';

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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const languages = ['all', 'Cree', 'Ojibwe', 'Inuktitut', 'Mohawk'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Language Courses
        </Typography>
        <Box display="flex" gap={1}>
          {languages.map((lang) => (
            <Chip
              key={lang}
              label={lang}
              onClick={() => setSelectedLanguage(lang)}
              color={selectedLanguage === lang ? 'primary' : 'default'}
              variant={selectedLanguage === lang ? 'filled' : 'outlined'}
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
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {course.thumbnail && (
                  <Box
                    component="img"
                    sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                    src={course.thumbnail}
                    alt={course.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" component="h2">
                      {course.title}
                    </Typography>
                    {course.completed && <CheckCircle color="success" />}
                  </Box>
                  <Chip label={course.level} size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                  {course.progress !== undefined && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress: {course.progress}%
                      </Typography>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          mt: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${course.progress}%`,
                            height: '100%',
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={course.completed ? <CheckCircle /> : <PlayArrow />}
                  >
                    {course.completed ? 'Review' : 'Continue'}
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
      </Box>
    </Container>
  );
};

