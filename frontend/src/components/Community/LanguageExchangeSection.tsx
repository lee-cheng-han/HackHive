import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  VideocamOutlined,
  MicOutlined,
  TranslateOutlined,
  MenuBookOutlined,
  PersonAdd,
  Schedule,
  Group,
  Language,
  VolumeUpOutlined,
  Close,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageExchange, sampleLanguageExchanges, sampleUsers } from '../../data/communityData';

export const LanguageExchangeSection: React.FC = () => {
  const { translate } = useLanguage();
  const [exchanges] = useState<LanguageExchange[]>(sampleLanguageExchanges);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [joinedSessions, setJoinedSessions] = useState<Set<string>>(new Set());

  const handleJoinSession = (exchangeId: string) => {
    setJoinedSessions(prev => new Set(prev.add(exchangeId)));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation': return <VideocamOutlined />;
      case 'pronunciation': return <VolumeUpOutlined />;
      case 'storytelling': return <MenuBookOutlined />;
      case 'translation': return <TranslateOutlined />;
      default: return <Language />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return themeColors.success.main;
      case 'intermediate': return themeColors.secondary.main;
      case 'advanced': return themeColors.primary.main;
      case 'mixed': return themeColors.accent.turquoise;
      default: return themeColors.secondary.main;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Language Exchange Sessions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Practice with community members in real-time conversations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ bgcolor: themeColors.secondary.main }}
        >
          Create Session
        </Button>
      </Box>

      {/* Quick Join Buttons */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Quick Join
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            size="small"
            startIcon={<MicOutlined />}
            sx={{ borderRadius: 20 }}
          >
            Pronunciation Help
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VideocamOutlined />}
            sx={{ borderRadius: 20 }}
          >
            Conversation Practice
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MenuBookOutlined />}
            sx={{ borderRadius: 20 }}
          >
            Storytelling Circle
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TranslateOutlined />}
            sx={{ borderRadius: 20 }}
          >
            Translation Workshop
          </Button>
        </Box>
      </Box>

      {/* Exchange Sessions */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 3,
        }}
      >
        {exchanges.map((exchange) => (
          <Card
            key={exchange.id}
              sx={{
                height: '100%',
                border: exchange.status === 'active' ? `2px solid ${themeColors.success.main}` : '1px solid #e0e0e0',
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {exchange.status === 'active' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    bgcolor: themeColors.success.main,
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: '0 4px 0 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  LIVE
                </Box>
              )}

              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  {getTypeIcon(exchange.type)}
                  <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                    {exchange.title}
                  </Typography>
                  <Chip
                    label={exchange.level}
                    size="small"
                    sx={{
                      bgcolor: getLevelColor(exchange.level),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {exchange.description}
                </Typography>

                {/* Host Info */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: exchange.host.isElder ? themeColors.accent.deep_red : themeColors.primary.main,
                    }}
                  >
                    {exchange.host.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {exchange.host.name}
                      {exchange.host.isElder && (
                        <Chip
                          label="Elder"
                          size="small"
                          sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                        />
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {exchange.host.nation}
                    </Typography>
                  </Box>
                </Box>

                {/* Session Details */}
                <Box display="flex" flex-wrap="wrap" gap={1} mb={2}>
                  <Chip
                    icon={<Language />}
                    label={exchange.language}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Schedule />}
                    label={new Date(exchange.scheduledTime).toLocaleString()}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Group />}
                    label={`${exchange.participants.length}/${exchange.maxParticipants}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Participants */}
                {exchange.participants.length > 0 && (
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      Participants:
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      {exchange.participants.slice(0, 3).map((participant, index) => (
                        <Tooltip key={participant.id} title={participant.name}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: '0.75rem',
                              bgcolor: participant.isElder ? themeColors.accent.deep_red : themeColors.primary.light,
                            }}
                          >
                            {participant.name.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      ))}
                      {exchange.participants.length > 3 && (
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          +{exchange.participants.length - 3}
                        </Avatar>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Action Button */}
                <Box mt={2}>
                  {exchange.status === 'full' ? (
                    <Button fullWidth disabled>
                      Session Full
                    </Button>
                  ) : exchange.status === 'active' ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<VideocamOutlined />}
                    >
                      Join Live Session
                    </Button>
                  ) : joinedSessions.has(exchange.id) ? (
                    <Button fullWidth variant="outlined" disabled>
                      Joined - You'll receive a reminder
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleJoinSession(exchange.id)}
                    >
                      Join Session
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
      </Box>

      {/* Create Session Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Create Language Exchange Session
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Session Title"
              placeholder="e.g., Beginner Cree Conversation Circle"
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Describe what participants will learn and practice"
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Session Type</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="conversation">Conversation Practice</MenuItem>
                  <MenuItem value="pronunciation">Pronunciation Help</MenuItem>
                  <MenuItem value="storytelling">Storytelling Circle</MenuItem>
                  <MenuItem value="translation">Translation Workshop</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Language Level</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="mixed">Mixed Levels</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Scheduled Time"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                type="number"
                label="Max Participants"
                defaultValue={6}
                inputProps={{ min: 2, max: 20 }}
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Create Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};