# Frontend Development Plan

**Developer**: Frontend Team Member  
**Component**: TurtleTalk Web Application - Four-Section Platform  
**Technology Stack**: React, TypeScript, Material-UI, Web Speech API, Axios, Howler.js

## Overview

Build a responsive, voice-first web application with four main sections: **Dashboard**, **Courses**, **Community**, and **Settings**. The UI integrates multiple AI services (Google Gemini for conversational tutor, ElevenLabs for TTS, Presage for engagement detection) and provides interactive language learning features including lessons, pronunciation practice, community stories, and progress tracking. The interface must be accessible, support offline mode, and work seamlessly across devices.

## Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser (Chrome/Edge recommended for Web Speech API)
- Code editor (VS Code recommended)
- Git

## Step-by-Step Execution Plan

### Phase 1: Project Setup (30 minutes)

#### 1.1 Initialize React Project
```bash
cd /Users/jingyu/HackHive
npx create-react-app frontend --template typescript
cd frontend
npm install
```

#### 1.2 Install Dependencies
```bash
# UI Components
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# State Management
npm install @reduxjs/toolkit react-redux
# OR use Context API (simpler, built-in)

# HTTP Client
npm install axios

# Routing
npm install react-router-dom

# Audio/Media
npm install howler  # For audio playback
npm install @types/howler  # TypeScript types

# Utilities
npm install uuid  # For generating IDs
npm install @types/uuid

# Service Worker (for offline mode)
npm install workbox-webpack-plugin  # Optional for PWA
```

#### 1.3 Project Structure
Create this folder structure:
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   └── RecommendationsList.tsx
│   │   ├── Courses/
│   │   │   ├── CourseModules.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── LessonView.tsx
│   │   │   └── QuizComponent.tsx
│   │   ├── Community/
│   │   │   ├── CommunityHub.tsx
│   │   │   ├── StoryUpload.tsx
│   │   │   ├── StoryList.tsx
│   │   │   └── DiscussionForum.tsx
│   │   ├── Settings/
│   │   │   ├── Settings.tsx
│   │   │   ├── LanguagePreferences.tsx
│   │   │   ├── AccessibilitySettings.tsx
│   │   │   └── AccountSettings.tsx
│   │   ├── Chat/
│   │   │   ├── ChatInterface.tsx      # AI Tutor Chat
│   │   │   ├── MessageBubble.tsx
│   │   │   └── VoiceInput.tsx
│   │   ├── Pronunciation/
│   │   │   ├── PronunciationCoach.tsx
│   │   │   ├── WordPractice.tsx
│   │   │   └── FeedbackDisplay.tsx
│   │   ├── Story/
│   │   │   ├── StoryScene.tsx
│   │   │   ├── StoryChoices.tsx
│   │   │   └── StoryImage.tsx
│   │   ├── Audio/
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── VoiceRecorder.tsx
│   │   ├── Accessibility/
│   │   │   ├── FontSizeControl.tsx
│   │   │   ├── HighContrastToggle.tsx
│   │   │   └── SubtitleDisplay.tsx
│   │   └── Navigation/
│   │       └── MainNavigation.tsx
│   ├── services/
│   │   ├── api.ts              # Backend API client
│   │   ├── gemini.ts           # Google Gemini API client
│   │   ├── elevenlabs.ts       # ElevenLabs TTS API client
│   │   ├── presage.ts          # Presage SDK integration
│   │   ├── speech.ts           # Web Speech API wrapper
│   │   └── audio.ts            # Audio utilities
│   ├── hooks/
│   │   ├── useVoiceInput.ts
│   │   ├── useStory.ts
│   │   ├── useAudio.ts
│   │   ├── usePresage.ts       # Presage engagement detection
│   │   └── useOffline.ts        # Offline mode management
│   ├── store/                  # Redux store (if using)
│   │   ├── slices/
│   │   │   ├── storySlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── progressSlice.ts
│   ├── types/
│   │   ├── story.ts
│   │   ├── user.ts
│   │   ├── course.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── offline.ts           # Offline storage utilities
│   └── App.tsx
├── public/
│   └── manifest.json            # PWA manifest for offline mode
└── package.json
```

### Phase 2: Core Components (2-3 hours)

#### 2.1 Create Type Definitions
**File**: `src/types/story.ts`
```typescript
export interface Story {
  story_id: string;
  language: string;
  title: string;
  level: string;
  scenes: StoryScene[];
}

export interface StoryScene {
  id: string;
  order: number;
  text: string;
  text_translation?: string;
  image_url?: string;
  audio_url?: string;
  choices?: Choice[];
  interaction_type: 'choice' | 'voice_response' | 'continue';
}

export interface Choice {
  id: string;
  text: string;
  text_translation?: string;
  next_scene: string;
  voice_prompt?: string;
}
```

**File**: `src/types/api.ts`
```typescript
export interface VoiceTranscriptionResponse {
  transcription: string;
  confidence: number;
  language_detected?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}
```

#### 2.2 Create API Service
**File**: `src/services/api.ts`
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const storyApi = {
  getStory: (storyId: string) => api.get(`/stories/${storyId}`),
  listStories: (params: { language?: string; level?: string }) => 
    api.get('/stories', { params }),
  getRecommendations: () => api.get('/recommendations'),
};

export const voiceApi = {
  transcribe: async (audioBlob: Blob, languageCode: string) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('language_code', languageCode);
    return api.post('/voice-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const userApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/user/profile'),
  updateProgress: (storyId: string, sceneId: string, status: string) =>
    api.post('/user/progress', { story_id: storyId, current_scene: sceneId, status }),
};

export default api;
```

#### 2.3 Create Speech Service
**File**: `src/services/speech.ts`
```typescript
export class SpeechService {
  private recognition: any;
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // Default, can be changed
    }
  }

  isSupported(): boolean {
    return !!this.recognition && !!this.synthesis;
  }

  startListening(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.start();
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speak(text: string, language: string = 'en-US') {
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }
}

export const speechService = new SpeechService();
```

#### 2.4 Create Voice Input Component
**File**: `src/components/Chat/VoiceInput.tsx`
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';
import { voiceApi } from '../../services/api';
import { speechService } from '../../services/speech';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  languageCode: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscription,
  languageCode,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please enable it in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert to WAV format (16kHz, mono, 16-bit PCM)
      // Note: You may need a library like 'wav-encoder' for proper conversion
      const wavBlob = await convertToWav(audioBlob);
      
      const response = await voiceApi.transcribe(wavBlob, languageCode);
      onTranscription(response.data.transcription);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToWav = async (blob: Blob): Promise<Blob> => {
    // Simplified - in production, use a proper audio conversion library
    // For now, return as-is (backend should handle conversion)
    return blob;
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Button
        variant="contained"
        color={isRecording ? 'error' : 'primary'}
        startIcon={isRecording ? <MicOff /> : <Mic />}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {isProcessing && <CircularProgress size={24} />}
      {isRecording && (
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: 'error.main',
            animation: 'pulse 1s infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        />
      )}
    </Box>
  );
};
```

### Phase 3: Story Interface (2-3 hours)

#### 3.1 Create Story Scene Component
**File**: `src/components/Story/StoryScene.tsx`
```typescript
import React, { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { StoryScene as StorySceneType } from '../../types/story';
import { StoryImage } from './StoryImage';
import { AudioPlayer } from '../Audio/AudioPlayer';
import { SubtitleDisplay } from '../Accessibility/SubtitleDisplay';
import { speechService } from '../../services/speech';

interface StorySceneProps {
  scene: StorySceneType;
  onChoiceSelect: (choiceId: string, nextScene: string) => void;
  autoPlayAudio?: boolean;
  showSubtitles?: boolean;
}

export const StoryScene: React.FC<StorySceneProps> = ({
  scene,
  onChoiceSelect,
  autoPlayAudio = true,
  showSubtitles = true,
}) => {
  useEffect(() => {
    if (autoPlayAudio && scene.audio_url) {
      // Auto-play audio when scene loads
    }
    
    // Auto-speak text if TTS is enabled
    if (autoPlayAudio && speechService.isSupported()) {
      speechService.speak(scene.text);
    }
  }, [scene.id, autoPlayAudio]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      {scene.image_url && <StoryImage src={scene.image_url} alt={scene.text} />}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" component="p" sx={{ mb: 1 }}>
          {scene.text}
        </Typography>
        {scene.text_translation && (
          <Typography variant="body2" color="text.secondary">
            {scene.text_translation}
          </Typography>
        )}
      </Box>

      {showSubtitles && (
        <SubtitleDisplay text={scene.text} />
      )}

      {scene.audio_url && (
        <AudioPlayer src={scene.audio_url} autoPlay={autoPlayAudio} />
      )}
    </Paper>
  );
};
```

#### 3.2 Create Chat Interface
**File**: `src/components/Chat/ChatInterface.tsx`
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container } from '@mui/material';
import { MessageBubble } from './MessageBubble';
import { VoiceInput } from './VoiceInput';
import { StoryScene } from '../Story/StoryScene';
import { StoryChoices } from '../Story/StoryChoices';
import { Story, StoryScene as StorySceneType } from '../../types/story';

interface ChatInterfaceProps {
  story: Story;
  languageCode: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = {
  const [currentSceneId, setCurrentSceneId] = useState<string>('scene1');
  const [messages, setMessages] = useState<Array<{ type: 'story' | 'user'; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentScene = story.scenes.find(s => s.id === currentSceneId) || story.scenes[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSceneId]);

  const handleChoiceSelect = (choiceId: string, nextScene: string) => {
    setCurrentSceneId(nextScene);
    const choice = currentScene.choices?.find(c => c.id === choiceId);
    if (choice) {
      setMessages(prev => [...prev, { type: 'user', content: choice.text }]);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setMessages(prev => [...prev, { type: 'user', content: text }]);
    // Process voice input and determine next scene
    // This would integrate with backend/NLP
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} type={msg.type} content={msg.content} />
        ))}
        
        <StoryScene
          scene={currentScene}
          onChoiceSelect={handleChoiceSelect}
          autoPlayAudio={true}
        />
        
        {currentScene.choices && (
          <StoryChoices
            choices={currentScene.choices}
            onSelect={handleChoiceSelect}
          />
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <VoiceInput
          onTranscription={handleVoiceTranscription}
          languageCode={languageCode}
        />
      </Box>
    </Container>
  );
};
```

### Phase 4: Accessibility Features (1-2 hours)

#### 4.1 Font Size Control
**File**: `src/components/Accessibility/FontSizeControl.tsx`
```typescript
import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';

export const FontSizeControl: React.FC = () => {
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');

  const sizes = {
    small: { fontSize: '0.875rem' },
    medium: { fontSize: '1rem' },
    large: { fontSize: '1.25rem' },
  };

  React.useEffect(() => {
    document.documentElement.style.fontSize = sizes[fontSize].fontSize;
  }, [fontSize]);

  return (
    <ButtonGroup>
      <Button onClick={() => setFontSize('small')} variant={fontSize === 'small' ? 'contained' : 'outlined'}>
        A
      </Button>
      <Button onClick={() => setFontSize('medium')} variant={fontSize === 'medium' ? 'contained' : 'outlined'}>
        A
      </Button>
      <Button onClick={() => setFontSize('large')} variant={fontSize === 'large' ? 'contained' : 'outlined'}>
        A
      </Button>
    </ButtonGroup>
  );
};
```

#### 4.2 High Contrast Mode
**File**: `src/components/Accessibility/HighContrastToggle.tsx`
```typescript
import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

export const HighContrastToggle: React.FC = () => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [enabled]);

  return (
    <FormControlLabel
      control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
      label="High Contrast Mode"
    />
  );
};
```

### Phase 5: Integration & Testing (1-2 hours)

#### 5.1 Main App Component
**File**: `src/App.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ChatInterface } from './components/Chat/ChatInterface';
import { storyApi } from './services/api';
import { Story } from './types/story';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

function App() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load a demo story or fetch from API
    const loadStory = async () => {
      try {
        // For demo, use mock data or fetch from API
        const response = await storyApi.getStory('story123');
        setStory(response.data);
      } catch (error) {
        console.error('Failed to load story:', error);
        // Use mock data as fallback
        setStory(mockStory);
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!story) return <div>No story available</div>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatInterface story={story} languageCode="cr" />
    </ThemeProvider>
  );
}

export default App;
```

#### 5.2 Environment Variables
**File**: `.env`
```
REACT_APP_API_URL=http://localhost:3001/api
```

#### 5.3 Testing Checklist
- [ ] Voice input captures audio
- [ ] Audio playback works
- [ ] Story scenes render correctly
- [ ] Choices navigate to next scene
- [ ] Subtitles display during audio
- [ ] Font size controls work
- [ ] High contrast mode applies
- [ ] Mobile responsive layout
- [ ] Error handling for API failures

## Deliverables

1. ✅ Working React app with chat interface
2. ✅ Voice input component (records and sends to backend)
3. ✅ Story rendering with images and audio
4. ✅ Choice selection and navigation
5. ✅ Accessibility features (font size, contrast, subtitles)
6. ✅ Integration with backend API
7. ✅ Responsive design for mobile/tablet

## Next Steps After Completion

1. Test with real backend API
2. Add loading states and error boundaries
3. Implement user authentication UI
4. Add progress tracking visualization
5. Polish animations and transitions
6. Test on multiple browsers and devices

### Phase 6: Four-Section Architecture (3-4 hours)

#### 6.1 Main Navigation Component
**File**: `src/components/Navigation/MainNavigation.tsx`
- Create tab-based navigation with 4 main sections: Dashboard, Courses, Community, Settings
- Use Material-UI BottomNavigation or AppBar with tabs
- Implement routing between sections
- Add active state indicators

#### 6.2 Dashboard Section
**File**: `src/components/Dashboard/Dashboard.tsx`
- Display user stats (words learned, stories completed, streak, level)
- Show recommended stories/lessons from ML service
- Progress visualization (charts/graphs)
- Recent activity feed
- Badges/achievements display
- Quick access to continue learning

#### 6.3 Courses Section
**File**: `src/components/Courses/CourseModules.tsx`
- List of language course modules (Cree, Ojibwe, Inuktitut, Mohawk, etc.)
- Filter by language and difficulty level
- Course cards with progress indicators
- Lesson view with interactive content
- Quiz components for assessment
- Progress tracking per course

#### 6.4 Community Section
**File**: `src/components/Community/CommunityHub.tsx`
- Story upload form for community contributions
- Browse community-contributed stories
- Discussion forum/threads
- Story ratings and comments
- Filter by language, theme, author
- Moderation indicators (approved/pending)

#### 6.5 Settings Section
**File**: `src/components/Settings/Settings.tsx`
- Language preferences (select Indigenous language and dialect)
- Accessibility settings (font size, high contrast, subtitles)
- Account management
- Privacy controls
- Offline mode settings (download content)
- Notification preferences

### Phase 7: AI Tutor Integration (2-3 hours)

#### 7.1 Google Gemini API Client
**File**: `src/services/gemini.ts`
```typescript
import axios from 'axios';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const geminiService = {
  async chatWithTutor(
    message: string,
    conversationHistory: Array<{role: string, content: string}>,
    language: string,
    userLevel: string
  ): Promise<string> {
    const systemPrompt = `You are a friendly ${language} language tutor. 
    Help users learn by:
    - Responding in ${language} when appropriate
    - Providing translations when needed
    - Gently correcting mistakes
    - Adapting to ${userLevel} level
    - Including cultural context when relevant`;
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: message }] }
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
  }
};
```

#### 7.2 AI Tutor Chat Interface
**File**: `src/components/Chat/ChatInterface.tsx`
- Integrate Gemini API for conversational responses
- Support both text and voice input
- Display conversation history
- Show typing indicators
- Handle errors gracefully (fallback to mock responses if API fails)
- Include "Explain" button to switch to English when needed

### Phase 8: ElevenLabs TTS Integration (1-2 hours)

#### 8.1 ElevenLabs API Client
**File**: `src/services/elevenlabs.ts`
```typescript
import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

export const elevenlabsService = {
  async generateSpeech(
    text: string,
    voiceId: string = 'default',
    language: string = 'en'
  ): Promise<Blob> {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      }
    );
    
    return response.data;
  },
  
  async playAudio(audioBlob: Blob): Promise<void> {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
    URL.revokeObjectURL(audioUrl);
  }
};
```

#### 8.2 TTS Integration Points
- Integrate ElevenLabs in:
  - Story narration (when no recorded audio available)
  - AI tutor voice responses
  - Pronunciation reference audio
  - Lesson word pronunciations
- Add play/pause controls
- Cache generated audio for offline use

### Phase 9: Pronunciation Coach (2-3 hours)

#### 9.1 Pronunciation Coach Component
**File**: `src/components/Pronunciation/PronunciationCoach.tsx`
- Word/phrase selection interface
- Record button for user practice
- Reference audio playback (from ElevenLabs or recordings)
- Display pronunciation score and feedback
- Visual feedback (waveform comparison, pitch visualization)
- Retry functionality
- Progress tracking per word

#### 9.2 Feedback Display
**File**: `src/components/Pronunciation/FeedbackDisplay.tsx`
- Show pronunciation score (0-100 or stars)
- Highlight specific phonemes/syllables that need work
- Provide actionable tips ("Hold the 'aa' sound longer")
- Visual indicators (green/yellow/red)
- Achievement unlocks for improvement

### Phase 10: Presage Integration (Optional, 2-3 hours)

#### 10.1 Presage SDK Integration
**File**: `src/services/presage.ts`
```typescript
// Import Presage SDK (check MLH docs for exact package name)
// Example: import { Presage } from '@presage/sdk';

export const presageService = {
  async initializeCamera(): Promise<void> {
    // Request camera permission
    // Initialize Presage SDK
  },
  
  async startMonitoring(
    onMetrics: (metrics: {
      heartRate: number;
      breathingRate: number;
      engagementScore: number;
      emotion: string;
    }) => void
  ): Promise<void> {
    // Start Presage monitoring
    // Call onMetrics callback with real-time data
  },
  
  async stopMonitoring(): Promise<void> {
    // Stop Presage monitoring
  }
};
```

#### 10.2 Engagement Detection Hook
**File**: `src/hooks/usePresage.ts`
- Opt-in camera access
- Monitor engagement metrics
- Trigger UI adaptations based on engagement:
  - Low engagement → offer hint or break
  - High engagement → increase difficulty
  - Frustration detected → show encouragement
- Display engagement indicator (optional)

### Phase 11: Offline Mode Support (2-3 hours)

#### 11.1 Service Worker Setup
**File**: `public/manifest.json`
- PWA manifest for installable app
- Offline caching strategy

#### 11.2 Offline Storage Utilities
**File**: `src/utils/offline.ts`
- Cache lesson content using IndexedDB
- Cache audio files for offline playback
- Sync progress when online
- Download content packages
- Show offline indicator

#### 11.3 Offline Mode Hook
**File**: `src/hooks/useOffline.ts`
- Detect online/offline status
- Queue API requests when offline
- Sync when connection restored
- Show sync status to user

## Updated Deliverables

1. ✅ Four-section UI (Dashboard, Courses, Community, Settings)
2. ✅ AI Conversational Tutor (Gemini integration)
3. ✅ Pronunciation Coach with feedback
4. ✅ Community story upload and browsing
5. ✅ ElevenLabs TTS integration
6. ✅ Presage engagement detection (optional)
7. ✅ Offline mode support
8. ✅ Progress tracking and recommendations
9. ✅ Accessibility features
10. ✅ Responsive design for mobile/tablet

## Integration Checklist

- [ ] Dashboard displays user stats and recommendations
- [ ] Courses section shows language modules with progress
- [ ] Community section allows story upload and browsing
- [ ] Settings section has all preference controls
- [ ] AI Tutor chat works with Gemini API
- [ ] ElevenLabs TTS generates audio for stories and tutor
- [ ] Pronunciation Coach provides feedback
- [ ] Presage integration detects engagement (if implemented)
- [ ] Offline mode caches content and syncs progress
- [ ] All features work on mobile devices
- [ ] Accessibility features (font size, contrast, subtitles) work

## Notes

- Use mock data initially if backend is not ready
- Test Web Speech API in Chrome/Edge first
- Handle microphone permission requests gracefully
- Ensure all text is readable with proper contrast
- Test with screen readers for accessibility
- **Gemini API**: Get API key from MLH or Google Cloud Console
- **ElevenLabs API**: Get API key from MLH or ElevenLabs dashboard
- **Presage SDK**: Check MLH docs for SDK installation and usage
- **Offline Mode**: Use service workers and IndexedDB for caching
- Handle API failures gracefully with fallbacks
- Cache AI responses when possible to reduce API calls

