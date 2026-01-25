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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  CalendarTodayOutlined,
  AddCircleOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  PeopleOutlined,
  CampaignOutlined,
  MenuBookOutlined,
  SchoolOutlined,
  CelebrationOutlined,
  MicOutlined,
  Close,
  NotificationsActiveOutlined,
  VideoCallOutlined,
  GroupsOutlined,
} from '@mui/icons-material';
import { themeColors } from '../../theme/theme';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'language_circle' | 'storytelling' | 'cultural_celebration' | 'workshop' | 'ceremony';
  date: string;
  time: string;
  duration: string;
  location: 'virtual' | 'hybrid' | 'in_person';
  maxParticipants?: number;
  currentParticipants: number;
  host: {
    name: string;
    nation: string;
    isElder: boolean;
    avatar?: string;
  };
  language: string;
  registrationRequired: boolean;
  isRecurring: boolean;
  tags: string[];
}

const sampleEvents: CommunityEvent[] = [
  {
    id: 'event-1',
    title: 'Weekly Plains Cree Language Circle',
    description: 'Join us for our weekly conversation circle where learners at all levels come together to practice Plains Cree in a supportive environment.',
    type: 'language_circle',
    date: '2024-01-28',
    time: '19:00',
    duration: '2 hours',
    location: 'virtual',
    maxParticipants: 15,
    currentParticipants: 8,
    host: {
      name: 'Elder Mary Sinclair',
      nation: 'Mistissini Cree Nation',
      isElder: true,
    },
    language: 'Plains Cree',
    registrationRequired: true,
    isRecurring: true,
    tags: ['beginner-friendly', 'conversation', 'weekly'],
  },
  {
    id: 'event-2',
    title: 'Traditional Winter Storytelling Session',
    description: 'Elder Robert Beargrease shares traditional winter stories and their cultural teachings. Stories will be told in Cree with English explanations.',
    type: 'storytelling',
    date: '2024-02-03',
    time: '15:00',
    duration: '3 hours',
    location: 'hybrid',
    maxParticipants: 50,
    currentParticipants: 23,
    host: {
      name: 'Elder Robert Beargrease',
      nation: 'Little Red River Cree Nation',
      isElder: true,
    },
    language: 'Woods Cree / English',
    registrationRequired: true,
    isRecurring: false,
    tags: ['traditional-stories', 'winter-teachings', 'cultural-knowledge'],
  },
  {
    id: 'event-3',
    title: 'Indigenous Language Revitalization Workshop',
    description: 'Learn practical strategies for incorporating Indigenous languages into daily life and community activities.',
    type: 'workshop',
    date: '2024-02-10',
    time: '10:00',
    duration: '4 hours',
    location: 'virtual',
    currentParticipants: 12,
    host: {
      name: 'David Okimaw',
      nation: 'Norway House Cree Nation',
      isElder: false,
    },
    language: 'English / Swampy Cree',
    registrationRequired: true,
    isRecurring: false,
    tags: ['language-revitalization', 'community-building', 'educational'],
  },
  {
    id: 'event-4',
    title: 'Pow Wow Preparation & Song Practice',
    description: 'Community gathering to practice traditional songs and prepare for the upcoming spring pow wow celebrations.',
    type: 'cultural_celebration',
    date: '2024-02-15',
    time: '18:30',
    duration: '2.5 hours',
    location: 'hybrid',
    currentParticipants: 35,
    host: {
      name: 'Jordan Whitehorse',
      nation: 'Bigstone Cree Nation',
      isElder: false,
    },
    language: 'Cree / English',
    registrationRequired: false,
    isRecurring: false,
    tags: ['pow-wow', 'music', 'cultural-celebration', 'community'],
  }
];

export const CommunityEventsSection: React.FC = () => {
  const { translate } = useLanguage();
  const [events] = useState<CommunityEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

  const handleRegister = (eventId: string) => {
    setRegisteredEvents(prev => new Set(prev.add(eventId)));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'language_circle': return <GroupsOutlined />;
      case 'storytelling': return <MenuBookOutlined />;
      case 'cultural_celebration': return <CelebrationOutlined />;
      case 'workshop': return <SchoolOutlined />;
      case 'ceremony': return <CampaignOutlined />;
      default: return <CalendarTodayOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'language_circle': return themeColors.secondary.main;
      case 'storytelling': return themeColors.accent.deep_red;
      case 'cultural_celebration': return themeColors.accent.amber;
      case 'workshop': return themeColors.primary.main;
      case 'ceremony': return themeColors.accent.purple;
      default: return themeColors.secondary.main;
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'virtual': return <VideoCallOutlined />;
      case 'hybrid': return <GroupsOutlined />;
      case 'in_person': return <LocationOnOutlined />;
      default: return <LocationOnOutlined />;
    }
  };

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isUpcoming = (date: string) => {
    return new Date(date) >= new Date();
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Community Events & Gatherings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join virtual and in-person events to connect with the Indigenous language community
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ bgcolor: themeColors.accent.amber }}
        >
          Create Event
        </Button>
      </Box>

      {/* Event Type Filters */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Browse Events by Type
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {[
            { key: 'language_circle', label: 'Language Circles', icon: <GroupsOutlined /> },
            { key: 'storytelling', label: 'Storytelling', icon: <MenuBookOutlined /> },
            { key: 'workshop', label: 'Workshops', icon: <SchoolOutlined /> },
            { key: 'cultural_celebration', label: 'Celebrations', icon: <CelebrationOutlined /> },
            { key: 'ceremony', label: 'Ceremonies', icon: <CampaignOutlined /> },
          ].map((type) => (
            <Button
              key={type.key}
              variant="outlined"
              startIcon={type.icon}
              size="small"
              sx={{
                borderRadius: 20,
                borderColor: getTypeColor(type.key),
                color: getTypeColor(type.key),
                '&:hover': {
                  bgcolor: getTypeColor(type.key),
                  color: 'white',
                },
              }}
            >
              {type.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Upcoming Events */}
      <Typography variant="h6" gutterBottom>
        Upcoming Events
      </Typography>
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 3,
          mb: 4,
        }}
      >
        {events.filter(event => isUpcoming(event.date)).map((event) => (
          <Card
            key={event.id}
            sx={{
              '&:hover': {
                boxShadow: 8,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
              border: event.isRecurring ? `2px solid ${themeColors.accent.sage}` : '1px solid #e0e0e0',
            }}
          >
            <CardContent>
              {/* Event Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getTypeIcon(event.type)}
                    <Chip
                      label={event.type.replace('_', ' ').toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getTypeColor(event.type),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    {event.isRecurring && (
                      <Chip
                        label="RECURRING"
                        size="small"
                        sx={{
                          bgcolor: themeColors.accent.sage,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {event.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                </Box>
              </Box>

              {/* Event Details */}
              <Box display="flex" flex-direction="column" gap={1} mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarTodayOutlined sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {formatEventDate(event.date)}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeOutlined sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {event.time} • {event.duration}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  {getLocationIcon(event.location)}
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {event.location.replace('_', ' ')}
                  </Typography>
                  {event.maxParticipants && (
                    <>
                      <PeopleOutlined sx={{ fontSize: 16, ml: 1 }} />
                      <Typography variant="body2">
                        {event.currentParticipants}/{event.maxParticipants} registered
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              {/* Host Info */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: event.host.isElder ? themeColors.accent.deep_red : themeColors.primary.main,
                  }}
                >
                  {event.host.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {event.host.name}
                    {event.host.isElder && (
                      <Chip
                        label="Elder"
                        size="small"
                        sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                      />
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.host.nation}
                  </Typography>
                </Box>
              </Box>

              {/* Tags */}
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                {event.tags.map((tag) => (
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
                  {registeredEvents.has(event.id) ? (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<NotificationsActiveOutlined />}
                      disabled
                    >
                      Registered
                    </Button>
                  ) : event.maxParticipants && event.currentParticipants >= event.maxParticipants ? (
                    <Button size="small" disabled>
                      Event Full
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleRegister(event.id)}
                    >
                      {event.registrationRequired ? 'Register' : 'Join Event'}
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {event.language}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Past Events */}
      {events.filter(event => !isUpcoming(event.date)).length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Past Events
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {events.filter(event => !isUpcoming(event.date)).map((event) => (
              <Card key={event.id} sx={{ opacity: 0.7 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatEventDate(event.date)} • Hosted by {event.host.name}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined">
                      View Recording
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog 
          open={!!selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                {getTypeIcon(selectedEvent.type)}
                <Box>
                  <Typography variant="h6">
                    {selectedEvent.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatEventDate(selectedEvent.date)} at {selectedEvent.time}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedEvent(null)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              {selectedEvent.description}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              Event Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    <CalendarTodayOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Date & Time"
                  secondary={`${formatEventDate(selectedEvent.date)} at ${selectedEvent.time} (${selectedEvent.duration})`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {getLocationIcon(selectedEvent.location)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Location"
                  secondary={selectedEvent.location.replace('_', ' ').toUpperCase()}
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: selectedEvent.host.isElder ? themeColors.accent.deep_red : themeColors.primary.main 
                  }}>
                    {selectedEvent.host.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${selectedEvent.host.name}${selectedEvent.host.isElder ? ' (Elder)' : ''}`}
                  secondary={selectedEvent.host.nation}
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
            {!registeredEvents.has(selectedEvent.id) && (
              <Button 
                variant="contained"
                onClick={() => {
                  handleRegister(selectedEvent.id);
                  setSelectedEvent(null);
                }}
              >
                {selectedEvent.registrationRequired ? 'Register' : 'Join Event'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Create Event Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Create Community Event
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Event Title"
              placeholder="e.g., Weekly Plains Cree Language Circle"
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              placeholder="Describe the event, what participants can expect, and any cultural protocols"
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="language_circle">Language Circle</MenuItem>
                  <MenuItem value="storytelling">Storytelling Session</MenuItem>
                  <MenuItem value="workshop">Educational Workshop</MenuItem>
                  <MenuItem value="cultural_celebration">Cultural Celebration</MenuItem>
                  <MenuItem value="ceremony">Ceremony</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Location Type</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="virtual">Virtual (Online)</MenuItem>
                  <MenuItem value="hybrid">Hybrid (Online + In-Person)</MenuItem>
                  <MenuItem value="in_person">In-Person Only</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                InputLabelProps={{ shrink: true }}
                required
              />
              
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                InputLabelProps={{ shrink: true }}
                required
              />
              
              <TextField
                fullWidth
                label="Duration"
                placeholder="e.g., 2 hours"
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Primary Language"
                placeholder="e.g., Plains Cree / English"
                required
              />
              
              <TextField
                fullWidth
                type="number"
                label="Max Participants (Optional)"
                inputProps={{ min: 1 }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              placeholder="e.g., beginner-friendly, traditional-stories, cultural-knowledge"
              helperText="Help people find your event"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};