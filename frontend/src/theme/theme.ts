import { createTheme } from '@mui/material/styles';

// Enhanced Indigenous-inspired color palette
export const themeColors = {
  primary: {
    main: '#8B4513',      // Saddle Brown - earth
    light: '#CD853F',     // Sienna - warm clay
    dark: '#654321',      // Dark brown - rich soil
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#4682B4',      // Steel Blue - sky/water
    light: '#87CEEB',     // Sky Blue - clear sky
    dark: '#2F4F4F',      // Dark slate - deep waters
    contrastText: '#FFFFFF',
  },
  accent: {
    sage: '#9CAF88',      // Sage green - prairie grass
    turquoise: '#40E0D0', // Turquoise - sacred stone
    ochre: '#CC7722',     // Yellow Ochre - sacred earth paint
    coral: '#FF7F50',     // Coral - sunset/fire
    deep_red: '#8B0000',  // Deep Red - traditional red
    purple: '#6A5ACD',    // Slate Purple - sacred color
    amber: '#FFBF00',     // Amber - golden light
    forest: '#2D5016',    // Forest Green
    sunset: '#FF8C42',    // Sunset orange
    terracotta: '#CD853F', // Terracotta - pottery
  },
  background: {
    default: '#FBF8F3',   // Warm cream
    paper: '#FFFFFF',
    subtle: '#F5EFE6',    // Light beige
    dark: '#3E3428',      // Dark warm brown
    pattern: '#F0E8D8',   // Pattern background
  },
  text: {
    primary: '#2C2416',   // Dark brown
    secondary: '#5D4E37', // Medium brown
    light: '#8B7355',     // Light brown
    inverse: '#FFFFFF',   // White text
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#D32F2F',
    light: '#E57373',
    dark: '#C62828',
  },
  nature: {
    sky: '#87CEEB',
    water: '#4682B4',
    earth: '#8B4513',
    fire: '#FF6347',
    grass: '#9CAF88',
    sunset: '#FF8C42',
  },
};

// Create Material-UI theme with enhanced Indigenous design
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: themeColors.primary.main,
      light: themeColors.primary.light,
      dark: themeColors.primary.dark,
      contrastText: themeColors.primary.contrastText,
    },
    secondary: {
      main: themeColors.secondary.main,
      light: themeColors.secondary.light,
      dark: themeColors.secondary.dark,
      contrastText: themeColors.secondary.contrastText,
    },
    background: {
      default: themeColors.background.default,
      paper: themeColors.background.paper,
    },
    text: {
      primary: themeColors.text.primary,
      secondary: themeColors.text.secondary,
    },
    success: {
      main: themeColors.success.main,
      light: themeColors.success.light,
    },
    warning: {
      main: themeColors.warning.main,
      light: themeColors.warning.light,
    },
    error: {
      main: themeColors.error.main,
      light: themeColors.error.light,
    },
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.75rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
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
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  shadows: [
    'none',
    '0 2px 4px rgba(139, 69, 19, 0.05)',
    '0 4px 8px rgba(139, 69, 19, 0.08)',
    '0 6px 12px rgba(139, 69, 19, 0.1)',
    '0 8px 16px rgba(139, 69, 19, 0.12)',
    '0 12px 24px rgba(139, 69, 19, 0.15)',
    '0 16px 32px rgba(139, 69, 19, 0.18)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
    '0 20px 40px rgba(139, 69, 19, 0.2)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: themeColors.background.default,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              ${themeColors.background.pattern} 50px,
              ${themeColors.background.pattern} 51px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              ${themeColors.background.pattern} 50px,
              ${themeColors.background.pattern} 51px
            )
          `,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 28px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s',
          },
          '&:hover::before': {
            transform: 'translateX(100%)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(139, 69, 19, 0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(139, 69, 19, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(139, 69, 19, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${themeColors.background.subtle}`,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${themeColors.accent.turquoise}, ${themeColors.accent.coral}, ${themeColors.accent.amber})`,
            opacity: 0,
            transition: 'opacity 0.3s',
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(139, 69, 19, 0.15)',
            '&::before': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(139, 69, 19, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          padding: '4px 8px',
        },
        colorPrimary: {
          background: `linear-gradient(135deg, ${themeColors.primary.main}, ${themeColors.primary.light})`,
          color: '#FFFFFF',
        },
        colorSecondary: {
          background: `linear-gradient(135deg, ${themeColors.secondary.main}, ${themeColors.secondary.light})`,
          color: '#FFFFFF',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: themeColors.background.subtle,
        },
        bar: {
          borderRadius: 8,
          background: `linear-gradient(90deg, ${themeColors.accent.turquoise}, ${themeColors.secondary.main})`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(139, 69, 19, 0.1)',
          borderBottom: `2px solid ${themeColors.accent.turquoise}`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          minHeight: 64,
          '&.Mui-selected': {
            color: themeColors.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: `linear-gradient(90deg, ${themeColors.accent.turquoise}, ${themeColors.primary.main})`,
        },
      },
    },
  },
});

export { theme };
