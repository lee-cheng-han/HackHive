import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Choice } from '../../types/story';

interface StoryChoicesProps {
  choices: Choice[];
  onSelect: (choiceId: string, nextScene: string) => void;
}

export const StoryChoices: React.FC<StoryChoicesProps> = ({ choices, onSelect }) => {
  if (!choices || choices.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        What would you like to do?
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {choices.map((choice) => (
          <Button
            key={choice.id}
            variant="outlined"
            fullWidth
            onClick={() => onSelect(choice.id, choice.next_scene)}
            sx={{
              textAlign: 'left',
              justifyContent: 'flex-start',
              py: 1.5,
            }}
          >
            <Box>
              <Typography variant="body1">{choice.text}</Typography>
              {choice.text_translation && (
                <Typography variant="caption" color="text.secondary">
                  {choice.text_translation}
                </Typography>
              )}
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

