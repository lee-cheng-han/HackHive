# TurtleTalk Design System

## Overview
The TurtleTalk design system is built with Indigenous-inspired aesthetics, using earth tones and nature colors to honor cultural heritage while maintaining modern, accessible design principles.

## Color Palette

### Primary Colors (Earth & Ground)
- **Primary Main**: `#8B4513` (Saddle Brown) - Main brand color
- **Primary Light**: `#A0522D` (Sienna) - Lighter earth tone
- **Primary Dark**: `#654321` (Dark Brown) - Deep earth tone

### Secondary Colors (Sky & Water)
- **Secondary Main**: `#4682B4` (Steel Blue) - Sky/water inspiration
- **Secondary Light**: `#87CEEB` (Sky Blue) - Light sky
- **Secondary Dark**: `#2F4F4F` (Dark Slate Gray) - Deep water

### Accent Colors (Nature)
- **Sage Green**: `#9CAF88` - Plants/nature
- **Terracotta**: `#CD853F` - Clay/earth
- **Sunset Orange**: `#FF8C42` - Warmth/energy
- **Forest Green**: `#228B22` - Nature/growth

### Background Colors
- **Default**: `#F5F5DC` (Beige) - Warm, soft background
- **Paper**: `#FFFFFF` (White) - Card backgrounds
- **Subtle**: `#FAF0E6` (Linen) - Subtle backgrounds

### Status Colors
- **Success**: `#4CAF50` (Green) - Growth, achievements
- **Warning**: `#FF9800` (Orange) - Cautions
- **Error**: `#F44336` (Red) - Errors
- **Info**: `#2196F3` (Blue) - Information

## Typography

### Font Family
System fonts for optimal performance and native feel:
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
```

### Type Scale
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.75rem (28px) - Subsection headers
- **H4**: 1.5rem (24px) - Card titles
- **H5**: 1.25rem (20px) - Small headers
- **H6**: 1.125rem (18px) - Smallest headers
- **Body 1**: 1rem (16px) - Main body text
- **Body 2**: 0.875rem (14px) - Secondary text

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700

## Spacing

Base spacing unit: **8px**

Common spacing values:
- `1` = 8px
- `2` = 16px
- `3` = 24px
- `4` = 32px
- `5` = 40px
- `6` = 48px

## Border Radius

- **Small**: 4px - Badges, chips
- **Medium**: 8px - Buttons, inputs
- **Large**: 12px - Cards, papers

## Shadows

Elevation system with soft, natural shadows:
- **Level 1**: `0 2px 8px rgba(0, 0, 0, 0.08)` - Cards
- **Level 2**: `0 4px 12px rgba(0, 0, 0, 0.1)` - Elevated cards
- **Level 3**: `0 6px 16px rgba(0, 0, 0, 0.12)` - Modals

## Components

### Buttons
- Border radius: 8px
- Padding: 10px 24px
- No text transform (keep original casing)
- Hover: Subtle shadow elevation

### Cards
- Border radius: 12px
- Default shadow: Level 1
- Hover: Transform translateY(-2px) + Level 2 shadow
- Transition: 0.3s ease

### Navigation
- Sticky position
- Gradient background (primary main to primary dark)
- Tab height: 64px
- Active indicator: Secondary light color

## Accessibility

### High Contrast Mode
- Background: Black (#000000)
- Text: White (#FFFFFF)
- Borders: White (#FFFFFF)
- Buttons: Yellow (#FFFF00) on black

### Focus States
- Outline: 2px solid secondary blue
- Offset: 2px

### Color Contrast
All text meets WCAG AA standards:
- Primary text on white: 12.6:1
- Secondary text on white: 7:1
- White text on primary: 4.5:1

## Responsive Breakpoints

- **xs**: 0px - Mobile
- **sm**: 600px - Tablet
- **md**: 900px - Desktop
- **lg**: 1200px - Large desktop
- **xl**: 1536px - Extra large

## Usage Examples

### Import Theme
```typescript
import { theme } from './theme/theme';
import { themeColors } from './theme/theme';
```

### Use Theme Colors
```typescript
sx={{ bgcolor: themeColors.primary.main }}
sx={{ color: themeColors.accent.sunset }}
```

### Apply Gradient
```typescript
sx={{
  background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.dark} 100%)`
}}
```

## Design Principles

1. **Cultural Respect**: Colors and aesthetics honor Indigenous heritage
2. **Accessibility First**: WCAG AA compliant, high contrast mode support
3. **Warm & Welcoming**: Soft backgrounds, friendly typography
4. **Modern & Clean**: Minimal design, clear hierarchy
5. **Responsive**: Works beautifully on all devices
6. **Performance**: System fonts, optimized shadows

## Component Patterns

### Stats Cards
- Gradient backgrounds
- Large numbers (h3)
- Icon in avatar
- White text on colored background

### Course Cards
- Image or icon placeholder
- Progress bar
- Completion badge
- Hover elevation

### Navigation
- Sticky header
- Icon + text tabs
- Active state indicator
- Responsive logo

