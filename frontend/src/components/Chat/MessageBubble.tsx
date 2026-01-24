import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface MessageBubbleProps {
  type: 'story' | 'user';
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ type, content }) => {
  const isUser = type === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.light' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="body1">{content}</Typography>
      </Paper>
    </Box>
  );
};

