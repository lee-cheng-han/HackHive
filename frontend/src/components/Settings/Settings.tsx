import React from 'react';
import { Box, Container, Typography, Paper, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { FontSizeControl } from '../Accessibility/FontSizeControl';
import { HighContrastToggle } from '../Accessibility/HighContrastToggle';

export const Settings: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Language Preferences
        </Typography>
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel>Preferred Language</InputLabel>
          <Select defaultValue="cree" label="Preferred Language">
            <MenuItem value="cree">Cree</MenuItem>
            <MenuItem value="ojibwe">Ojibwe</MenuItem>
            <MenuItem value="inuktitut">Inuktitut</MenuItem>
            <MenuItem value="mohawk">Mohawk</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Dialect</InputLabel>
          <Select defaultValue="plains" label="Dialect">
            <MenuItem value="plains">Plains Cree</MenuItem>
            <MenuItem value="swampy">Swampy Cree</MenuItem>
            <MenuItem value="woodland">Woodland Cree</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Accessibility
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Font Size
            </Typography>
            <FontSizeControl />
          </Box>
          <Box sx={{ mb: 2 }}>
            <HighContrastToggle />
          </Box>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Subtitles"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Voice Input Enabled"
          />
          <FormControlLabel
            control={<Switch />}
            label="Kids Mode"
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Change Password
          </Button>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Edit Profile
          </Button>
          <Button variant="outlined" color="error">
            Delete Account
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Privacy & Data
        </Typography>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Allow data collection for personalization"
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Your progress and learning data helps us improve recommendations
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

