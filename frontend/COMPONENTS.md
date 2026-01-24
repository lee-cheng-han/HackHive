# TurtleTalk Component Library

## Overview
A comprehensive library of reusable UI components built with Material-UI and our custom design system.

## Common Components

### LoadingSpinner
Displays a loading spinner with optional message.

```tsx
<LoadingSpinner message="Loading..." size={40} fullScreen={false} />
```

**Props:**
- `message?: string` - Loading message
- `size?: number` - Spinner size (default: 40)
- `fullScreen?: boolean` - Full screen overlay (default: false)

---

### EmptyState
Shows an empty state with icon, title, description, and optional action.

```tsx
<EmptyState
  icon="📚"
  title="No stories yet"
  description="Start by uploading your first story"
  actionLabel="Upload Story"
  onAction={() => handleUpload()}
/>
```

---

### Badge
Colored badge component with variants.

```tsx
<Badge label="New" variant="primary" size="medium" icon={<Icon />} />
```

**Variants:** `primary`, `success`, `warning`, `info`, `default`
**Sizes:** `small`, `medium`, `large`

---

### SearchBar
Search input with icon and clear button.

```tsx
<SearchBar
  placeholder="Search..."
  onSearch={(query) => handleSearch(query)}
  fullWidth={true}
/>
```

---

### Toast
Notification toast for success, error, warning, info messages.

```tsx
<Toast
  open={open}
  message="Operation successful!"
  severity="success"
  onClose={() => setOpen(false)}
  autoHideDuration={4000}
/>
```

---

### ProgressRing
Circular progress indicator with percentage.

```tsx
<ProgressRing
  value={75}
  size={120}
  label="Progress"
  color="primary"
  showValue={true}
/>
```

**Colors:** `primary`, `success`, `warning`, `error`

---

### StatCard
Statistic card with icon, value, label, and optional trend.

```tsx
<StatCard
  icon={<Book />}
  value={42}
  label="Words Learned"
  color="primary"
  gradient={true}
  trend={{ value: 12, isPositive: true }}
/>
```

---

### FilterChips
Filter chips for multi-select or single-select filtering.

```tsx
<FilterChips
  options={[
    { label: 'All', value: 'all' },
    { label: 'Cree', value: 'cree' }
  ]}
  selected={selectedFilters}
  onToggle={(value) => handleToggle(value)}
  multiple={true}
/>
```

---

### Modal
Modal dialog component.

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Modal Title"
  maxWidth="sm"
  actions={
    <>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  Modal content here
</Modal>
```

---

### AvatarWithBadge
Avatar with optional online indicator and badge.

```tsx
<AvatarWithBadge
  src="/avatar.jpg"
  size={48}
  online={true}
  badge={<Badge label="3" />}
  badgePosition="top-right"
/>
```

---

### SkeletonLoader
Loading skeleton placeholders.

```tsx
<SkeletonLoader variant="rectangular" width="100%" height={200} count={3} />
<CardSkeleton /> // Pre-configured card skeleton
<ListSkeleton count={5} /> // Pre-configured list skeleton
```

---

### ActionButton
Styled button with variants and tooltip support.

```tsx
<ActionButton
  colorVariant="primary"
  icon={<Book />}
  tooltip="Click to learn more"
  onClick={handleClick}
>
  Learn More
</ActionButton>
```

**Color Variants:** `primary`, `secondary`, `success`, `warning`, `error`

---

### DividerWithText
Divider with centered text.

```tsx
<DividerWithText text="Section Title" variant="primary" />
```

---

## Usage Example

```tsx
import {
  LoadingSpinner,
  EmptyState,
  Badge,
  SearchBar,
  Toast,
  StatCard,
  Modal,
} from './components/Common';

function MyComponent() {
  return (
    <>
      <StatCard
        icon={<Book />}
        value={42}
        label="Words Learned"
        color="primary"
      />
      <SearchBar onSearch={(q) => console.log(q)} />
      <Badge label="New" variant="success" />
    </>
  );
}
```

## Design System Integration

All components use the TurtleTalk design system:
- Colors from `themeColors`
- Typography from theme
- Consistent spacing and borders
- Responsive design
- Accessibility features

## Component Showcase

To see all components in action, import and render `ComponentShowcase`:

```tsx
import { ComponentShowcase } from './components/Common/ComponentShowcase';

<ComponentShowcase />
```

