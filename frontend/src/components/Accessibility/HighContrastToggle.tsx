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

