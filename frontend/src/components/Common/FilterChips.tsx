import React from 'react';
import { Box, Chip } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  multiple?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selected,
  onToggle,
  multiple = true,
}) => {
  const handleClick = (value: string) => {
    if (!multiple && selected.includes(value)) {
      return; // Don't allow deselecting in single-select mode
    }
    onToggle(value);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => handleClick(option.value)}
            sx={{
              bgcolor: isSelected
                ? themeColors.primary.main
                : 'transparent',
              color: isSelected
                ? 'white'
                : themeColors.text.primary,
              border: `2px solid ${
                isSelected
                  ? themeColors.primary.main
                  : themeColors.primary.light
              }`,
              fontWeight: isSelected ? 600 : 500,
              '&:hover': {
                bgcolor: isSelected
                  ? themeColors.primary.dark
                  : themeColors.background.subtle,
              },
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          />
        );
      })}
    </Box>
  );
};

