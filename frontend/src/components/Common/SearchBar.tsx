import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { themeColors } from '../../theme/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  fullWidth?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  fullWidth = true,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: themeColors.text.secondary }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: themeColors.text.secondary }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: themeColors.background.paper,
            '&:hover': {
              bgcolor: themeColors.background.subtle,
            },
            '&.Mui-focused': {
              bgcolor: themeColors.background.paper,
            },
          },
        }}
      />
    </Box>
  );
};

