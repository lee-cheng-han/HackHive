import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  TranslateOutlined,
  AddCircleOutlined,
  GroupOutlined,
  AccessTimeOutlined,
  PriorityHighOutlined,
  CheckCircleOutlined,
  PlayCircleOutlineOutlined,
  ExpandMoreOutlined,
  Close,
  VolunteerActivismOutlined,
  SchoolOutlined,
  LocalHospitalOutlined,
  AccountBalanceOutlined,
  MenuBookOutlined,
  EditOutlined,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { TranslationProject, sampleTranslationProjects } from '../../data/communityData';

export const TranslationCollaborationSection: React.FC = () => {
  const { translate } = useLanguage();
  const [projects] = useState<TranslationProject[]>(sampleTranslationProjects);
  const [selectedProject, setSelectedProject] = useState<TranslationProject | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [joinedProjects, setJoinedProjects] = useState<Set<string>>(new Set());

  const handleJoinProject = (projectId: string) => {
    setJoinedProjects(prev => new Set(prev.add(projectId)));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return themeColors.error?.main || '#f44336';
      case 'high': return themeColors.accent.coral;
      case 'medium': return themeColors.secondary.main;
      case 'low': return themeColors.accent.sage;
      default: return themeColors.secondary.main;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical': return <LocalHospitalOutlined />;
      case 'legal': return <AccountBalanceOutlined />;
      case 'educational': return <SchoolOutlined />;
      case 'cultural': return <MenuBookOutlined />;
      case 'literature': return <MenuBookOutlined />;
      default: return <TranslateOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return themeColors.success.main;
      case 'in_progress': return themeColors.secondary.main;
      case 'review': return themeColors.accent.amber;
      case 'open': return themeColors.primary.main;
      default: return themeColors.primary.main;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Translation Collaboration Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preserve Indigenous knowledge through collaborative translation projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ bgcolor: themeColors.accent.turquoise }}
        >
          Propose Project
        </Button>
      </Box>

      {/* Priority Categories */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Active Translation Needs
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {[
            { key: 'urgent', label: 'Urgent', color: '#f44336', count: 2 },
            { key: 'community-health', label: 'Community Health', color: themeColors.accent.coral, count: 1 },
            { key: 'cultural-preservation', label: 'Cultural Preservation', color: themeColors.accent.deep_red, count: 3 },
            { key: 'education', label: 'Education Materials', color: themeColors.secondary.main, count: 5 },
            { key: 'legal', label: 'Legal Documents', color: themeColors.accent.amber, count: 2 },
          ].map((category) => (
            <Chip
              key={category.key}
              label={`${category.label} (${category.count})`}
              variant="outlined"
              sx={{
                borderColor: category.color,
                color: category.color,
                '&:hover': {
                  bgcolor: `${category.color}20`,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Translation Projects */}
      <Box display="flex" flexDirection="column" gap={3}>
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{
              border: project.priority === 'urgent' ? `2px solid ${getPriorityColor('urgent')}` : '1px solid #e0e0e0',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              {/* Project Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getCategoryIcon(project.category)}
                    <Typography variant="h6" fontWeight={600}>
                      {project.title}
                    </Typography>
                    <Chip
                      label={project.priority.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(project.priority),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={project.status.replace('_', ' ').toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: getStatusColor(project.status),
                        color: getStatusColor(project.status),
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                </Box>
                
                <Box display="flex" gap={1}>
                  <Tooltip title="View details">
                    <IconButton onClick={() => setSelectedProject(project)}>
                      <ExpandMoreOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Project Details */}
              <Box display="flex" flex-wrap="wrap" gap={1} mb={2}>
                <Chip
                  icon={<TranslateOutlined />}
                  label={`${project.originalLanguage} → ${project.targetLanguage}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<GroupOutlined />}
                  label={`${project.contributors.length + 1} contributors`}
                  size="small"
                  variant="outlined"
                />
                {project.deadline && (
                  <Chip
                    icon={<AccessTimeOutlined />}
                    label={`Due ${new Date(project.deadline).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: new Date(project.deadline) < new Date() ? '#f44336' : 'inherit',
                      borderColor: new Date(project.deadline) < new Date() ? '#f44336' : 'inherit',
                    }}
                  />
                )}
              </Box>

              {/* Coordinator & Contributors */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    Coordinated by:
                  </Typography>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: project.coordinator.isElder ? themeColors.accent.deep_red : themeColors.primary.main,
                      fontSize: '0.75rem',
                    }}
                  >
                    {project.coordinator.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight={600}>
                    {project.coordinator.name}
                  </Typography>
                </Box>
                
                {project.contributors.length > 0 && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary">
                      Contributors:
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      {project.contributors.slice(0, 3).map((contributor) => (
                        <Tooltip key={contributor.id} title={contributor.name}>
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: contributor.isElder ? themeColors.accent.deep_red : themeColors.primary.light,
                            }}
                          >
                            {contributor.name.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      ))}
                      {project.contributors.length > 3 && (
                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem' }}>
                          +{project.contributors.length - 3}
                        </Avatar>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Progress */}
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Translation Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {project.currentProgress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.currentProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: project.currentProgress >= 80 ? themeColors.success.main : 
                              project.currentProgress >= 50 ? themeColors.secondary.main : 
                              themeColors.accent.amber,
                    },
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={1}>
                  {project.status === 'completed' ? (
                    <Button
                      size="small"
                      startIcon={<CheckCircleOutlined />}
                      disabled
                    >
                      Completed
                    </Button>
                  ) : joinedProjects.has(project.id) ? (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditOutlined />}
                      sx={{ bgcolor: themeColors.secondary.main }}
                    >
                      Continue Translation
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VolunteerActivismOutlined />}
                      onClick={() => handleJoinProject(project.id)}
                    >
                      Join Project
                    </Button>
                  )}
                  <Button size="small" startIcon={<PlayCircleOutlineOutlined />}>
                    View Sample
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)} • Community Impact
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog 
          open={!!selectedProject} 
          onClose={() => setSelectedProject(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                {getCategoryIcon(selectedProject.category)}
                <Box>
                  <Typography variant="h6">
                    {selectedProject.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedProject.originalLanguage} → {selectedProject.targetLanguage}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedProject(null)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Project Overview
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  {selectedProject.description}
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <Chip label={`Priority: ${selectedProject.priority}`} size="small" />
                  <Chip label={`Category: ${selectedProject.category}`} size="small" />
                  <Chip label={`Progress: ${selectedProject.currentProgress}%`} size="small" />
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Sample Text
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  Original ({selectedProject.originalLanguage}):
                </Typography>
                <Typography variant="body2" sx={{ 
                  bgcolor: 'rgba(0,0,0,0.05)', 
                  p: 2, 
                  borderRadius: 1,
                  mb: 2 
                }}>
                  {selectedProject.originalText}
                </Typography>
                
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  Translation Progress ({selectedProject.targetLanguage}):
                </Typography>
                <Typography variant="body2" sx={{ 
                  bgcolor: 'rgba(139, 69, 19, 0.05)', 
                  p: 2, 
                  borderRadius: 1,
                  border: `1px solid ${themeColors.primary.light}`
                }}>
                  [Translation in progress - {selectedProject.currentProgress}% complete]
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Contributors & Coordination
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: selectedProject.coordinator.isElder ? themeColors.accent.deep_red : themeColors.primary.main 
                      }}>
                        {selectedProject.coordinator.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={selectedProject.coordinator.name}
                      secondary={`Project Coordinator • ${selectedProject.coordinator.nation}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Lead" size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {selectedProject.contributors.map((contributor) => (
                    <ListItem key={contributor.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: contributor.isElder ? themeColors.accent.deep_red : themeColors.primary.light 
                        }}>
                          {contributor.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contributor.name}
                        secondary={`Contributor • ${contributor.nation}`}
                      />
                      {contributor.isElder && (
                        <ListItemSecondaryAction>
                          <Chip label="Elder" size="small" />
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProject(null)}>
              Close
            </Button>
            <Button variant="contained">
              Join Translation Team
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create Project Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Propose New Translation Project
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Project Title"
              placeholder="e.g., Community Health Resources for Plains Cree"
              required
            />
            
            <TextField
              fullWidth
              label="Project Description"
              multiline
              rows={4}
              placeholder="Describe the translation project, its importance to the community, and the expected impact"
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Source Language</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="french">French</MenuItem>
                  <MenuItem value="cree-oral">Cree (Oral Tradition)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Target Language</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="plains-cree">Plains Cree</MenuItem>
                  <MenuItem value="woods-cree">Woods Cree</MenuItem>
                  <MenuItem value="swampy-cree">Swampy Cree</MenuItem>
                  <MenuItem value="english">English</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="medical">Medical/Health</MenuItem>
                  <MenuItem value="legal">Legal Documents</MenuItem>
                  <MenuItem value="educational">Educational Materials</MenuItem>
                  <MenuItem value="cultural">Cultural Texts</MenuItem>
                  <MenuItem value="literature">Literature</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Priority Level</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              type="date"
              label="Target Completion Date"
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Sample Text"
              multiline
              rows={4}
              placeholder="Provide a sample of the text to be translated"
              helperText="This helps potential contributors understand the scope and style of the project"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Propose Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};