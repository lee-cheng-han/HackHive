import React from 'react';
import { Button, ButtonProps, Tooltip } from '@mui/material';
import { themeColors } from '../../theme/theme';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  tooltip?: string;
  icon?: React.ReactNode;
  colorVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  tooltip,
  icon,
  colorVariant = 'primary',
  children,
  ...props
}) => {
  const variantColors = {
    primary: themeColors.primary.main,
    secondary: themeColors.secondary.main,
    success: themeColors.success.main,
    warning: themeColors.warning.main,
    error: themeColors.error.main,
  };

  const button = (
    <Button
      variant="contained"
      startIcon={icon}
      sx={{
        bgcolor: variantColors[colorVariant],
        '&:hover': {
          bgcolor: variantColors[colorVariant],
          opacity: 0.9,
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};

