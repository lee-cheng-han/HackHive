import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  VolumeUpOutlined,
  FavoriteOutlined,
  FavoriteBorderOutlined,
  CommentOutlined,
  ShareOutlined,
  TranslateOutlined,
  InfoOutlined,
  AddCircleOutlined,
  ExpandMoreOutlined,
  Close,
  PlayArrowOutlined,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { CommunityStory, sampleStories } from '../../data/communityData';

export const CulturalStoriesSection: React.FC = () => {
  const { translate } = useLanguage();
  const [stories] = useState<CommunityStory[]>(sampleStories);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const [selectedStory, setSelectedStory] = useState<CommunityStory | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});

  const handleLike = (storyId: string) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const handleToggleTranslation = (storyId: string) => {
    setShowTranslation(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'traditional': return themeColors.accent.deep_red;
      case 'personal': return themeColors.secondary.main;
      case 'teaching': return themeColors.accent.amber;
      case 'legend': return themeColors.accent.purple;
      case 'history': return themeColors.accent.forest;
      default: return themeColors.primary.main;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Cultural Stories & Oral Traditions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share and preserve Indigenous stories, teachings, and cultural knowledge
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ bgcolor: themeColors.accent.deep_red }}
        >
          Share Story
        </Button>
      </Box>

      {/* Category Filters */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Browse by Category
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {['All Stories', 'Traditional', 'Personal', 'Teaching', 'Legend', 'History'].map((category) => (
            <Chip
              key={category}
              label={category}
              variant={category === 'All Stories' ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 20,
                ...(category === 'All Stories' && {
                  bgcolor: themeColors.primary.main,
                  color: 'white',
                }),
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Stories */}
      <Box display="flex" flexDirection="column" gap={3}>
        {stories.map((story) => (
          <Card
            key={story.id}
            sx={{
              '&:hover': {
                boxShadow: 8,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              {/* Story Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip
                      label={story.category}
                      size="small"
                      sx={{
                        bgcolor: getCategoryColor(story.category),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={story.language}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {showTranslation[story.id] ? story.titleCree : story.title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: story.author.isElder ? themeColors.accent.deep_red : themeColors.primary.main,
                      }}
                    >
                      {story.author.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {story.author.name}
                        {story.author.isElder && (
                          <Chip
                            label="Elder"
                            size="small"
                            sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                          />
                        )}
                        {story.author.isLanguageKeeper && (
                          <Chip
                            label="Language Keeper"
                            size="small"
                            sx={{ ml: 1, height: 18, fontSize: '0.7rem', bgcolor: themeColors.accent.amber }}
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.author.nation} • {new Date(story.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" gap={1}>
                  <Tooltip title="Toggle translation">
                    <IconButton onClick={() => handleToggleTranslation(story.id)}>
                      <TranslateOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Story details">
                    <IconButton onClick={() => setSelectedStory(story)}>
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Story Content */}
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  fontStyle: showTranslation[story.id] ? 'italic' : 'normal',
                  bgcolor: showTranslation[story.id] ? 'rgba(139, 69, 19, 0.05)' : 'transparent',
                  p: showTranslation[story.id] ? 2 : 0,
                  borderRadius: 1,
                  border: showTranslation[story.id] ? `1px solid ${themeColors.primary.light}` : 'none',
                }}
              >
                {showTranslation[story.id] ? story.contentCree : story.content}
              </Typography>

              {/* Tags */}
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                {story.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                ))}
              </Box>

              {/* Actions */}
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    startIcon={likedStories.has(story.id) ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
                    onClick={() => handleLike(story.id)}
                    sx={{
                      color: likedStories.has(story.id) ? themeColors.accent.coral : 'inherit',
                    }}
                  >
                    {story.likes + (likedStories.has(story.id) ? 1 : 0)}
                  </Button>
                  <Button size="small" startIcon={<CommentOutlined />}>
                    {story.comments.length} Comments
                  </Button>
                  {story.audioUrl && (
                    <Button size="small" startIcon={<PlayArrowOutlined />}>
                      Listen
                    </Button>
                  )}
                </Box>
                <Button size="small" startIcon={<ShareOutlined />}>
                  Share
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Story Details Dialog */}
      {selectedStory && (
        <Dialog 
          open={!!selectedStory} 
          onClose={() => setSelectedStory(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Cultural Context & Background
              <IconButton onClick={() => setSelectedStory(null)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedStory.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Shared by:</strong> {selectedStory.author.name} ({selectedStory.author.nation})
            </Typography>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Cultural Context
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {selectedStory.culturalContext}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Cree Translation
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  <strong>{selectedStory.titleCree}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  {selectedStory.contentCree}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedStory(null)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create Story Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Share Your Story or Teaching
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Story Title (English)"
              placeholder="e.g., The Teaching of the Seven Fires"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Story Title (Indigenous Language)"
              placeholder="e.g., nîso-kîkway kîskinohamâkêwin"
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select defaultValue="">
                <MenuItem value="traditional">Traditional Story</MenuItem>
                <MenuItem value="personal">Personal Experience</MenuItem>
                <MenuItem value="teaching">Cultural Teaching</MenuItem>
                <MenuItem value="legend">Legend/Myth</MenuItem>
                <MenuItem value="history">Historical Account</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Story Content (English)"
              multiline
              rows={6}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Story Content (Indigenous Language)"
              multiline
              rows={6}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Cultural Context"
              multiline
              rows={3}
              placeholder="Explain the cultural significance, background, or teaching purpose of this story"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              placeholder="e.g., prophecy, traditional-teaching, wisdom"
              margin="normal"
            />

            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Upload Audio Recording
              </Button>
              <Typography variant="caption" color="text.secondary">
                Share the authentic pronunciation and rhythm of your story
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Share Story
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};