import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Card, CardContent, Button, Chip, LinearProgress, Avatar, CircularProgress } from '@mui/material';
import { PlayArrow, CheckCircle, School } from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { CourseDetail } from './CourseDetail';
import { Course, Lesson } from '../../types/course';

interface CourseModulesProps {
  courses?: Course[];
}

export const CourseModules: React.FC<CourseModulesProps> = ({ 
  courses: propCourses
}) => {
  const [courses, setCourses] = useState<Course[]>(propCourses || []);
  const [loading, setLoading] = useState(!propCourses);
  const [error, setError] = useState<string>('');
  
  // Fetch courses from API on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses from API...');
        const response = await fetch('http://localhost:3001/api/v1/courses');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Courses fetched:', data);
          
          // Add our advanced sentence practice course
          const advancedCourse = {
            id: 'advanced-sentence-practice',
            title: 'Advanced AI Sentence Practice',
            description: 'Experience our cutting-edge VITS model with complex Cree sentences. Perfect for demonstrating advanced AI capabilities.',
            language: 'cr',
            level: 'advanced',
            thumbnail: '/images/advanced-ai-course.png',
            lessons: [
              {
                id: 'hackhive-love',
                courseId: 'advanced-sentence-practice',
                title: 'HackHive Expression',
                description: 'Learn to express love and appreciation using modern technology terms',
                order: 1,
                type: 'pronunciation',
                completed: true,
                content: {
                  text: 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ',
                  translation: 'We love HackHive',
                  vocabulary: [
                    {
                      word: 'ᐊᐧᐸ᐀',
                      translation: 'we',
                      pronunciation: 'awapa',
                      audioUrl: '/audio/awapa.wav'
                    },
                    {
                      word: 'ᒪᓇᐦᑲ',
                      translation: 'love/appreciate',
                      pronunciation: 'manahka',
                      audioUrl: '/audio/manahka.wav'
                    }
                  ],
                  examples: [
                    {
                      text: 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ',
                      translation: 'We love HackHive',
                      audioUrl: '/audio/cree_love_hackhive.wav'
                    }
                  ]
                },
                exercises: [
                  {
                    id: 'pronunciation-hackhive',
                    type: 'pronunciation',
                    question: 'Listen and repeat: "We love HackHive"',
                    correctAnswer: 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ',
                    audioUrl: '/audio/cree_love_hackhive.wav',
                    points: 50
                  }
                ],
                audioUrl: '/audio/cree_love_hackhive.wav',
                estimatedTime: 5
              } as Lesson,
              {
                id: 'university-pride',
                courseId: 'advanced-sentence-practice',
                title: 'University Pride Expression',
                description: 'Express school pride and competitive spirit in Cree',
                order: 2,
                type: 'pronunciation',
                content: {
                  text: 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ',
                  translation: 'Ontario Tech University in Oshawa is the best university, let us win this!',
                  vocabulary: [
                    {
                      word: 'ᐅᐄ̊ᓀᐸᕁ',
                      translation: 'Ontario',
                      pronunciation: 'onitario',
                      audioUrl: '/audio/ontario.wav'
                    },
                    {
                      word: 'ᑮᓇᐨᑮ̄ᐃᐣ',
                      translation: 'university/school',
                      pronunciation: 'kinasikawin',
                      audioUrl: '/audio/university.wav'
                    },
                    {
                      word: 'ᐱᐞᒪ',
                      translation: 'best/excellent',
                      pronunciation: 'piyakwa',
                      audioUrl: '/audio/best.wav'
                    }
                  ],
                  examples: [
                    {
                      text: 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ',
                      translation: 'Ontario Tech University in Oshawa is the best university, let us win this!',
                      audioUrl: '/audio/ontario_tech_cree.wav'
                    }
                  ]
                },
                exercises: [
                  {
                    id: 'pronunciation-university',
                    type: 'pronunciation',
                    question: 'Listen and repeat: University pride expression',
                    correctAnswer: 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ',
                    audioUrl: '/audio/ontario_tech_cree.wav',
                    points: 50
                  }
                ],
                audioUrl: '/audio/ontario_tech_cree.wav',
                estimatedTime: 5
              } as Lesson
            ],
            progress: 0,
            completed: false,
            estimatedTime: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Course;
          
          setCourses([...data, advancedCourse]);
          setError('');
        } else {
          const errorText = await response.text();
          console.error('API error:', response.status, errorText);
          setError(`API Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to connect to backend. Using demo data.');
        // Fallback to demo course if API fails
        setCourses([
          {
            id: 'demo-course',
            title: 'Plains Cree Basics (Demo)',
            description: 'Demo course - backend not connected',
            language: 'cr',
            level: 'beginner',
            lessons: [],
          } as Course,
          {
            id: 'advanced-sentence-practice',
            title: 'Advanced AI Sentence Practice',
            description: 'Experience our cutting-edge VITS model with complex Cree sentences. Perfect for demonstrating advanced AI capabilities.',
            language: 'cr',
            level: 'advanced',
            thumbnail: '/images/advanced-ai-course.png',
            lessons: [
              {
                id: 'hackhive-love',
                courseId: 'advanced-sentence-practice',
                title: 'HackHive Expression',
                description: 'Learn to express love and appreciation using modern technology terms',
                order: 1,
                type: 'pronunciation',
                completed: true,
                content: {
                  text: 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ',
                  translation: 'We love HackHive',
                  vocabulary: [
                    {
                      word: 'ᐊᐧᐸ᐀',
                      translation: 'we',
                      pronunciation: 'awapa',
                      audioUrl: '/audio/awapa.wav'
                    },
                    {
                      word: 'ᒪᓇᐦᑲ',
                      translation: 'love/appreciate',
                      pronunciation: 'manahka',
                      audioUrl: '/audio/manahka.wav'
                    }
                  ],
                  examples: [
                    {
                      text: 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ',
                      translation: 'We love HackHive',
                      audioUrl: '/audio/cree_love_hackhive.wav'
                    }
                  ]
                },
                exercises: [
                  {
                    id: 'pronunciation-hackhive',
                    type: 'pronunciation',
                    question: 'Listen and repeat: "We love HackHive"',
                    correctAnswer: 'ᐊᐧᐸ᐀ ᐊ̄ᐧᐸ᐀ᐆ ᒪᐧᐸ ᒪᓇᐦᑲ',
                    audioUrl: '/audio/cree_love_hackhive.wav',
                    points: 50
                  }
                ],
                audioUrl: '/audio/cree_love_hackhive.wav',
                estimatedTime: 5
              } as Lesson,
              {
                id: 'university-pride',
                courseId: 'advanced-sentence-practice',
                title: 'University Pride Expression',
                description: 'Express school pride and competitive spirit in Cree',
                order: 2,
                type: 'pronunciation',
                content: {
                  text: 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ',
                  translation: 'Ontario Tech University in Oshawa is the best university, let us win this!',
                  vocabulary: [
                    {
                      word: 'ᐅᐄ̊ᓀᐸᕁ',
                      translation: 'Ontario',
                      pronunciation: 'onitario',
                      audioUrl: '/audio/ontario.wav'
                    },
                    {
                      word: 'ᑮᓇᐨᑮ̄ᐃᐣ',
                      translation: 'university/school',
                      pronunciation: 'kinasikawin',
                      audioUrl: '/audio/university.wav'
                    },
                    {
                      word: 'ᐱᐞᒪ',
                      translation: 'best/excellent',
                      pronunciation: 'piyakwa',
                      audioUrl: '/audio/best.wav'
                    }
                  ],
                  examples: [
                    {
                      text: 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ',
                      translation: 'Ontario Tech University in Oshawa is the best university, let us win this!',
                      audioUrl: '/audio/ontario_tech_cree.wav'
                    }
                  ]
                },
                exercises: [
                  {
                    id: 'pronunciation-university',
                    type: 'pronunciation',
                    question: 'Listen and repeat: University pride expression',
                    correctAnswer: 'ᐅᐄ̊ᓀᐸᕁ ᑮᓇᐨᑮ̄ᐃᐣ ᐊ̄ᑐ̵ᕁ ᐱᐞᒪ ᑮᓇᐨᑮ̄ᐃᐣ',
                    audioUrl: '/audio/ontario_tech_cree.wav',
                    points: 50
                  }
                ],
                audioUrl: '/audio/ontario_tech_cree.wav',
                estimatedTime: 5
              } as Lesson
            ],
            progress: 0,
            completed: false,
            estimatedTime: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Course
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  const { translate } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const languages = [
    { value: 'all', label: translate('courses.filter.all') },
    { value: 'Cree', label: translate('courses.filter.cree') },
    { value: 'Ojibwe', label: translate('courses.filter.ojibwe') },
    { value: 'Inuktitut', label: translate('courses.filter.inuktitut') },
    { value: 'Mohawk', label: translate('courses.filter.mohawk') },
  ];

  // If a course is selected, show course detail
  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onLessonStart={(lessonId) => {
          // Navigate to lesson
          console.log('Starting lesson:', lessonId);
        }}
      />
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          {translate('common.loading')}
        </Typography>
      </Container>
    );
  }

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
                    label={course.level === 'beginner' 
                      ? translate('courses.level.beginner')
                      : course.level === 'intermediate'
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
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setSelectedCourse(course)}
                    sx={{ mt: 1 }}
                  >
                    {translate('course.viewDetails') || 'View Details'}
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
      </Box>
    </Container>
  );
};

