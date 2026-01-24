import { createTheme } from '@mui/material/styles';

// Indigenous-inspired color palette
// Earth tones, nature colors that honor cultural aesthetics
const colors = {
  // Primary colors - inspired by earth and nature
  primary: {
    main: '#8B4513',      // Saddle Brown - earth/ground
    light: '#A0522D',     // Sienna - lighter earth
    dark: '#654321',      // Dark Brown - deep earth
    contrastText: '#FFFFFF',
  },
  // Secondary colors - inspired by sky and water
  secondary: {
    main: '#4682B4',      // Steel Blue - sky/water
    light: '#87CEEB',    // Sky Blue - light sky
    dark: '#2F4F4F',     // Dark Slate Gray - deep water
    contrastText: '#FFFFFF',
  },
  // Accent colors - inspired by nature
  accent: {
    sage: '#9CAF88',      // Sage green - plants
    terracotta: '#CD853F', // Terracotta - clay
    sunset: '#FF8C42',    // Sunset orange - warmth
    forest: '#228B22',    // Forest green - nature
  },
  // Neutral colors
  background: {
    default: '#F5F5DC',   // Beige - warm, soft background
    paper: '#FFFFFF',     // White for cards
    subtle: '#FAF0E6',    // Linen - subtle background
  },
  // Text colors
  text: {
    primary: '#2C2C2C',   // Almost black
    secondary: '#5C5C5C', // Medium gray
    disabled: '#9E9E9E',  // Light gray
  },
  // Status colors
  success: {
    main: '#4CAF50',      // Green - growth, success
    light: '#81C784',
    dark: '#388E3C',
  },
  warning: {
    main: '#FF9800',      // Orange - caution
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#F44336',      // Red - errors
    light: '#E57373',
    dark: '#D32F2F',
  },
  info: {
    main: '#2196F3',      // Blue - information
    light: '#64B5F6',
    dark: '#1976D2',
  },
};

// Typography - readable, accessible fonts
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none', // Keep button text as-is (no uppercase)
    fontWeight: 600,
  },
};

// Component customizations
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: '1rem',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      elevation2: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      elevation3: {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.95rem',
        minHeight: 64,
        '&.Mui-selected': {
          fontWeight: 600,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
};

// Create the theme
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: colors.background,
    text: colors.text,
  },
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base spacing unit
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 6px 16px rgba(0, 0, 0, 0.12)',
    '0 8px 20px rgba(0, 0, 0, 0.14)',
    '0 10px 24px rgba(0, 0, 0, 0.16)',
    '0 12px 28px rgba(0, 0, 0, 0.18)',
    '0 14px 32px rgba(0, 0, 0, 0.2)',
    '0 16px 36px rgba(0, 0, 0, 0.22)',
    '0 18px 40px rgba(0, 0, 0, 0.24)',
    '0 20px 44px rgba(0, 0, 0, 0.26)',
    '0 22px 48px rgba(0, 0, 0, 0.28)',
    '0 24px 52px rgba(0, 0, 0, 0.3)',
    '0 26px 56px rgba(0, 0, 0, 0.32)',
    '0 28px 60px rgba(0, 0, 0, 0.34)',
    '0 30px 64px rgba(0, 0, 0, 0.36)',
    '0 32px 68px rgba(0, 0, 0, 0.38)',
    '0 34px 72px rgba(0, 0, 0, 0.4)',
    '0 36px 76px rgba(0, 0, 0, 0.42)',
    '0 38px 80px rgba(0, 0, 0, 0.44)',
    '0 40px 84px rgba(0, 0, 0, 0.46)',
    '0 42px 88px rgba(0, 0, 0, 0.48)',
    '0 44px 92px rgba(0, 0, 0, 0.5)',
    '0 46px 96px rgba(0, 0, 0, 0.52)',
  ],
});

// Export color constants for use in components
export const themeColors = colors;

