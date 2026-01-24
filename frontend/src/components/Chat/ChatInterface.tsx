import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { MessageBubble } from './MessageBubble';
import { VoiceInput } from './VoiceInput';
import { StoryScene } from '../Story/StoryScene';
import { StoryChoices } from '../Story/StoryChoices';
import { Story, StoryScene as StorySceneType } from '../../types/story';
import { storyApi } from '../../services/api';

interface ChatInterfaceProps {
  story: Story;
  languageCode: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ story, languageCode }) => {
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
    // This would integrate with backend/NLP in full implementation
    // For now, we'll just add it to messages
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
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

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <VoiceInput
          onTranscription={handleVoiceTranscription}
          languageCode={languageCode}
        />
      </Box>
    </Container>
  );
};

