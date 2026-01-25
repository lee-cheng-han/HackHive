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
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  QuestionAnswerOutlined,
  SchoolOutlined,
  TheaterComedyOutlined,
  TranslateOutlined,
  HelpOutlineOutlined,
  AddCircleOutlined,
  ThumbUpOutlined,
  ReplyOutlined,
  PushPinOutlined,
  TrendingUpOutlined,
  Close,
  VisibilityOutlined,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { Discussion, sampleDiscussions } from '../../data/communityData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const CommunityForumsSection: React.FC = () => {
  const { translate } = useLanguage();
  const [discussions] = useState<Discussion[]>(sampleDiscussions);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar': return <SchoolOutlined />;
      case 'pronunciation': return <QuestionAnswerOutlined />;
      case 'culture': return <TheaterComedyOutlined />;
      case 'translation': return <TranslateOutlined />;
      case 'general': return <HelpOutlineOutlined />;
      default: return <QuestionAnswerOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grammar': return themeColors.primary.main;
      case 'pronunciation': return themeColors.secondary.main;
      case 'culture': return themeColors.accent.deep_red;
      case 'translation': return themeColors.accent.turquoise;
      case 'general': return themeColors.accent.sage;
      default: return themeColors.secondary.main;
    }
  };

  const getFilteredDiscussions = () => {
    switch (activeTab) {
      case 0: return discussions; // All
      case 1: return discussions.filter(d => d.isPinned || d.isSticky); // Featured
      case 2: return [...discussions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Recent
      case 3: return [...discussions].sort((a, b) => b.views - a.views); // Popular
      default: return discussions;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Community Discussion Forums
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask questions, share knowledge, and connect with other learners
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ bgcolor: themeColors.secondary.main }}
        >
          Start Discussion
        </Button>
      </Box>

      {/* Quick Categories */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Browse Categories
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {[
            { key: 'grammar', label: 'Grammar Help', icon: <SchoolOutlined /> },
            { key: 'pronunciation', label: 'Pronunciation', icon: <QuestionAnswerOutlined /> },
            { key: 'culture', label: 'Cultural Context', icon: <TheaterComedyOutlined /> },
            { key: 'translation', label: 'Translation Help', icon: <TranslateOutlined /> },
            { key: 'general', label: 'General Questions', icon: <HelpOutlineOutlined /> },
          ].map((category) => (
            <Button
              key={category.key}
              variant="outlined"
              startIcon={category.icon}
              size="small"
              sx={{
                borderRadius: 20,
                borderColor: getCategoryColor(category.key),
                color: getCategoryColor(category.key),
                '&:hover': {
                  bgcolor: getCategoryColor(category.key),
                  color: 'white',
                },
              }}
            >
              {category.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Discussion Filters */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab icon={<QuestionAnswerOutlined />} iconPosition="start" label="All Discussions" />
          <Tab icon={<PushPinOutlined />} iconPosition="start" label="Featured" />
          <Tab icon={<Badge badgeContent="New" color="secondary"><TrendingUpOutlined /></Badge>} iconPosition="start" label="Recent" />
          <Tab icon={<VisibilityOutlined />} iconPosition="start" label="Popular" />
        </Tabs>
      </Box>

      {/* Discussion Lists */}
      <TabPanel value={activeTab} index={0}>
        <DiscussionList discussions={getFilteredDiscussions()} onSelect={setSelectedDiscussion} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <DiscussionList discussions={getFilteredDiscussions()} onSelect={setSelectedDiscussion} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <DiscussionList discussions={getFilteredDiscussions()} onSelect={setSelectedDiscussion} />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <DiscussionList discussions={getFilteredDiscussions()} onSelect={setSelectedDiscussion} />
      </TabPanel>

      {/* Discussion Detail Dialog */}
      {selectedDiscussion && (
        <Dialog 
          open={!!selectedDiscussion} 
          onClose={() => setSelectedDiscussion(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                {getCategoryIcon(selectedDiscussion.category)}
                <Box>
                  <Typography variant="h6">
                    {selectedDiscussion.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedDiscussion.views} views • {selectedDiscussion.replies.length} replies
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedDiscussion(null)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar sx={{ bgcolor: selectedDiscussion.author.isElder ? themeColors.accent.deep_red : themeColors.primary.main }}>
                {selectedDiscussion.author.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {selectedDiscussion.author.name}
                  {selectedDiscussion.author.isElder && (
                    <Chip label="Elder" size="small" sx={{ ml: 1, height: 18, fontSize: '0.7rem' }} />
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedDiscussion.author.nation} • {new Date(selectedDiscussion.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {selectedDiscussion.content}
            </Typography>

            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" gap={2} mb={3}>
              <Button size="small" startIcon={<ThumbUpOutlined />}>
                Helpful
              </Button>
              <Button size="small" startIcon={<ReplyOutlined />}>
                Reply
              </Button>
            </Box>

            {/* Reply Field */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your thoughts or answer to help the community..."
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDiscussion(null)}>
              Close
            </Button>
            <Button variant="contained">
              Post Reply
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create Discussion Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Start a New Discussion
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Discussion Title"
              placeholder="e.g., How do you handle vowel length in different Cree dialects?"
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select defaultValue="">
                <MenuItem value="grammar">Grammar Help</MenuItem>
                <MenuItem value="pronunciation">Pronunciation</MenuItem>
                <MenuItem value="culture">Cultural Context</MenuItem>
                <MenuItem value="translation">Translation Help</MenuItem>
                <MenuItem value="general">General Questions</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Language Focus</InputLabel>
              <Select defaultValue="">
                <MenuItem value="plains-cree">Plains Cree</MenuItem>
                <MenuItem value="woods-cree">Woods Cree</MenuItem>
                <MenuItem value="swampy-cree">Swampy Cree</MenuItem>
                <MenuItem value="multiple">Multiple Dialects</MenuItem>
                <MenuItem value="general">Language-Agnostic</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Your Question or Topic"
              multiline
              rows={6}
              placeholder="Describe your question or topic in detail. The more context you provide, the better answers you'll receive!"
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Tags (optional)"
              placeholder="e.g., vowel-length, dialects, pronunciation"
              margin="normal"
              helperText="Add tags to help others find your discussion"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Start Discussion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Discussion List Component
interface DiscussionListProps {
  discussions: Discussion[];
  onSelect: (discussion: Discussion) => void;
}

const DiscussionList: React.FC<DiscussionListProps> = ({ discussions, onSelect }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar': return <SchoolOutlined />;
      case 'pronunciation': return <QuestionAnswerOutlined />;
      case 'culture': return <TheaterComedyOutlined />;
      case 'translation': return <TranslateOutlined />;
      case 'general': return <HelpOutlineOutlined />;
      default: return <QuestionAnswerOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grammar': return themeColors.primary.main;
      case 'pronunciation': return themeColors.secondary.main;
      case 'culture': return themeColors.accent.deep_red;
      case 'translation': return themeColors.accent.turquoise;
      case 'general': return themeColors.accent.sage;
      default: return themeColors.secondary.main;
    }
  };

  return (
    <List>
      {discussions.map((discussion) => (
        <Card key={discussion.id} sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => onSelect(discussion)}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getCategoryColor(discussion.category) }}>
                {getCategoryIcon(discussion.category)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  {discussion.isPinned && <PushPinOutlined color="primary" sx={{ fontSize: 16 }} />}
                  <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                    {discussion.title}
                  </Typography>
                  <Chip label={discussion.category} size="small" />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {discussion.content.length > 150 ? `${discussion.content.substring(0, 150)}...` : discussion.content}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="caption">
                        by <strong>{discussion.author.name}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                      <Typography variant="caption" color="text.secondary">
                        {discussion.replies.length} replies
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {discussion.views} views
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        </Card>
      ))}
    </List>
  );
};