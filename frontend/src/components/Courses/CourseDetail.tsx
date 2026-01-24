import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  CheckCircle,
  Lock,
  School,
  AccessTime,
} from '@mui/icons-material';
import { Course, Lesson } from '../../types/course';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { LessonView } from './LessonView';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onLessonStart: (lessonId: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onBack,
  onLessonStart,
}) => {
  const { translate } = useLanguage();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentLessonIndex(course.lessons.findIndex(l => l.id === lesson.id));
  };

  const handleLessonComplete = (lessonId: string) => {
    // Update lesson completion status
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.completed = true;
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentLessonIndex + 1];
      setSelectedLesson(nextLesson);
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = course.lessons[currentLessonIndex - 1];
      setSelectedLesson(prevLesson);
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  // If a lesson is selected, show lesson view
  if (selectedLesson) {
    return (
      <LessonView
        lesson={selectedLesson}
        courseTitle={course.title}
        onComplete={handleLessonComplete}
        onNext={handleNextLesson}
        onPrevious={handlePreviousLesson}
        hasNext={currentLessonIndex < course.lessons.length - 1}
        hasPrevious={currentLessonIndex > 0}
      />
    );
  }

  // Show course overview
  const completedLessons = course.lessons.filter(l => l.completed).length;
  const overallProgress = (completedLessons / course.lessons.length) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
        {translate('common.back')}
      </Button>

      {/* Course Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={3} flexWrap="wrap">
          {course.thumbnail && (
            <Box
              component="img"
              src={course.thumbnail}
              alt={course.title}
              sx={{
                width: { xs: '100%', sm: 200 },
                height: 150,
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          )}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Chip
                label={
                  course.level === 'beginner'
                    ? translate('courses.level.beginner')
                    : course.level === 'intermediate'
                    ? translate('courses.level.intermediate')
                    : translate('courses.level.advanced')
                }
                size="small"
                sx={{ bgcolor: themeColors.accent.sage, color: 'white' }}
              />
              {course.completed && (
                <Chip
                  icon={<CheckCircle />}
                  label={translate('course.completed') || 'Completed'}
                  color="success"
                  size="small"
                />
              )}
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {course.description}
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              {course.estimatedTime && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {course.estimatedTime} {translate('course.minutes') || 'minutes'}
                  </Typography>
                </Box>
              )}
              <Box display="flex" alignItems="center" gap={0.5}>
                <School fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {course.lessons.length} {translate('course.lessons') || 'lessons'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Progress */}
        {course.progress !== undefined && (
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                {translate('course.progress') || 'Progress'}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {Math.round(overallProgress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: themeColors.background.subtle,
                '& .MuiLinearProgress-bar': {
                  bgcolor: course.completed
                    ? themeColors.success.main
                    : themeColors.primary.main,
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Lessons List */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            {translate('course.lessons') || 'Lessons'}
          </Typography>
        </Box>
        <List>
          {course.lessons.map((lesson, index) => {
            const isLocked = index > 0 && !course.lessons[index - 1].completed;
            const isCompleted = lesson.completed;

            return (
              <React.Fragment key={lesson.id}>
                <ListItem
                  disablePadding
                  sx={{
                    bgcolor: isLocked ? themeColors.background.subtle : 'transparent',
                    opacity: isLocked ? 0.6 : 1,
                  }}
                >
                  <ListItemButton
                    onClick={() => !isLocked && handleLessonClick(lesson)}
                    disabled={isLocked}
                  >
                    <ListItemIcon>
                      {isCompleted ? (
                        <CheckCircle sx={{ color: themeColors.success.main }} />
                      ) : isLocked ? (
                        <Lock color="disabled" />
                      ) : (
                        <PlayArrow sx={{ color: themeColors.primary.main }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight={600}>
                            {index + 1}. {lesson.title}
                          </Typography>
                          {lesson.type && (
                            <Chip
                              label={lesson.type}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          {lesson.description && (
                            <Typography variant="body2" color="text.secondary">
                              {lesson.description}
                            </Typography>
                          )}
                          {lesson.estimatedTime && (
                            <Typography variant="caption" color="text.secondary">
                              {lesson.estimatedTime} {translate('course.minutes') || 'min'}
                            </Typography>
                          )}
                          {lesson.progress !== undefined && (
                            <LinearProgress
                              variant="determinate"
                              value={lesson.progress}
                              sx={{ mt: 1, height: 4, borderRadius: 2 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < course.lessons.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </Paper>

      {/* Start Course Button */}
      {course.lessons.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={() => handleLessonClick(course.lessons[0])}
            sx={{ px: 4 }}
          >
            {course.progress && course.progress > 0
              ? translate('course.continue') || 'Continue Learning'
              : translate('course.start') || 'Start Course'}
          </Button>
        </Box>
      )}
    </Container>
  );
};

