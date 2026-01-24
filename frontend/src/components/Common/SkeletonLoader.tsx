import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  count?: number;
  animation?: 'pulse' | 'wave' | false;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  count = 1,
  animation = 'pulse',
}) => {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation={animation}
          sx={{ mb: count > 1 ? 1 : 0 }}
        />
      ))}
    </Box>
  );
};

// Pre-configured skeleton loaders
export const CardSkeleton: React.FC = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" width="100%" height={180} sx={{ mb: 2, borderRadius: 2 }} />
    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
    <Skeleton variant="text" width="80%" height={16} />
  </Box>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={16} />
        </Box>
      </Box>
    ))}
  </Box>
);

