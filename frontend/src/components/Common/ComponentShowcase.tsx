import React, { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import {
  LoadingSpinner,
  EmptyState,
  Badge,
  SearchBar,
  Toast,
  ProgressRing,
  StatCard,
  FilterChips,
  Modal,
  AvatarWithBadge,
  SkeletonLoader,
  CardSkeleton,
  ActionButton,
  DividerWithText,
} from './index';
import { Book, Search, CheckCircle, Warning } from '@mui/icons-material';
import { themeColors } from '../../theme/theme';

/**
 * Component Showcase - For development/testing purposes
 * This file demonstrates all available common components
 */
export const ComponentShowcase: React.FC = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Cree', value: 'cree' },
    { label: 'Ojibwe', value: 'ojibwe' },
    { label: 'Inuktitut', value: 'inuktitut' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Component Showcase
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Loading Spinner */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Loading Spinner
            </Typography>
            <LoadingSpinner message="Loading content..." />
          </Paper>
        </Box>

        {/* Empty State */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Empty State
            </Typography>
            <EmptyState
              icon="📚"
              title="No stories yet"
              description="Start by uploading your first story to share with the community"
              actionLabel="Upload Story"
              onAction={() => console.log('Upload clicked')}
            />
          </Paper>
        </Box>

        {/* Badges */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Badges
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Badge label="Primary" variant="primary" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Info" variant="info" />
              <Badge
                label="With Icon"
                variant="primary"
                icon={<CheckCircle sx={{ fontSize: 16 }} />}
              />
            </Box>
          </Paper>
        </Box>

        {/* Search Bar */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Bar
            </Typography>
            <SearchBar
              placeholder="Search stories, courses..."
              onSearch={(query) => console.log('Search:', query)}
            />
          </Paper>
        </Box>

        {/* Progress Ring */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progress Ring
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
              <ProgressRing value={75} label="Progress" />
              <ProgressRing value={45} color="success" />
              <ProgressRing value={90} color="warning" />
            </Box>
          </Paper>
        </Box>

        {/* Stat Card */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stat Card
            </Typography>
            <StatCard
              icon={<Book />}
              value={42}
              label="Words Learned"
              color="primary"
              trend={{ value: 12, isPositive: true }}
            />
          </Paper>
        </Box>

        {/* Filter Chips */}
        <Box sx={{ flex: '1 1 100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filter Chips
            </Typography>
            <FilterChips
              options={filterOptions}
              selected={selectedFilters}
              onToggle={(value) => {
                setSelectedFilters((prev) =>
                  prev.includes(value)
                    ? prev.filter((v) => v !== value)
                    : [...prev, value]
                );
              }}
            />
          </Paper>
        </Box>

        {/* Avatar with Badge */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Avatar with Badge
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <AvatarWithBadge
                size={48}
                online
                badge={<Badge label="3" variant="error" size="small" />}
              />
              <AvatarWithBadge size={56} online />
              <AvatarWithBadge size={64} />
            </Box>
          </Paper>
        </Box>

        {/* Skeleton Loaders */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skeleton Loaders
            </Typography>
            <CardSkeleton />
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ flex: '1 1 100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Action Buttons
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <ActionButton colorVariant="primary" icon={<Book />}>
                Primary Action
              </ActionButton>
              <ActionButton colorVariant="success" icon={<CheckCircle />}>
                Success Action
              </ActionButton>
              <ActionButton colorVariant="warning" icon={<Warning />}>
                Warning Action
              </ActionButton>
              <ActionButton
                colorVariant="primary"
                tooltip="This is a tooltip"
              >
                With Tooltip
              </ActionButton>
            </Box>
          </Paper>
        </Box>

        {/* Divider with Text */}
        <Box sx={{ flex: '1 1 100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Divider with Text
            </Typography>
            <DividerWithText text="Section Divider" variant="primary" />
            <DividerWithText text="Another Section" variant="secondary" />
          </Paper>
        </Box>

        {/* Modal */}
        <Box sx={{ flex: '1 1 100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Modal
            </Typography>
            <ActionButton
              colorVariant="primary"
              onClick={() => setModalOpen(true)}
            >
              Open Modal
            </ActionButton>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Example Modal"
              actions={
                <>
                  <ActionButton
                    colorVariant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    colorVariant="primary"
                    onClick={() => setModalOpen(false)}
                  >
                    Confirm
                  </ActionButton>
                </>
              }
            >
              <Typography>
                This is an example modal. You can put any content here.
              </Typography>
            </Modal>
          </Paper>
        </Box>
      </Box>

      {/* Toast */}
      <Toast
        open={toastOpen}
        message="This is a toast notification!"
        severity="success"
        onClose={() => setToastOpen(false)}
      />
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <ActionButton
          colorVariant="primary"
          onClick={() => setToastOpen(true)}
        >
          Show Toast
        </ActionButton>
      </Box>
    </Container>
  );
};

