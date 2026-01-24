import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';

export const FontSizeControl: React.FC = () => {
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');

  React.useEffect(() => {
    const root = document.documentElement;
    const sizes = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
    };
    root.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  return (
    <ButtonGroup size="small">
      <Button 
        onClick={() => setFontSize('small')} 
        variant={fontSize === 'small' ? 'contained' : 'outlined'}
        sx={{ minWidth: 40 }}
      >
        A
      </Button>
      <Button 
        onClick={() => setFontSize('medium')} 
        variant={fontSize === 'medium' ? 'contained' : 'outlined'}
        sx={{ minWidth: 40 }}
      >
        A
      </Button>
      <Button 
        onClick={() => setFontSize('large')} 
        variant={fontSize === 'large' ? 'contained' : 'outlined'}
        sx={{ minWidth: 40 }}
      >
        A
      </Button>
    </ButtonGroup>
  );
};

