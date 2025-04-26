# Gym App Component Structure

## Component Organization

Components in this application should follow these organizational patterns:

### Directory Structure

```
components/
├── feature-name/
│   ├── use-feature-hook.ts
│   ├── feature-component.tsx
│   ├── feature-list.tsx
│   └── sub-components/
│       ├── feature-item.tsx
│       └── feature-details.tsx
```

### Component File Structure

```typescript
// Import statements
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cn } from '~/utils/tailwind';

// Types
interface FeatureComponentProps {
  data: FeatureData;
  onAction: () => void;
}

// Component
export function FeatureComponent({ data, onAction }: FeatureComponentProps) {
  // Hooks
  const { t } = useTranslation();
  
  // State and derived values
  
  // Event handlers
  
  // Render
  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-bold">{t('feature.title')}</Text>
    </View>
  );
}
```

## Hooks Organization

Custom hooks should be separated into their own files:

```typescript
// use-feature-hook.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function useFeature(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feature', id],
    queryFn: () => fetchFeatureData(id)
  });
  
  return {
    data,
    isLoading,
    error
  };
}
```

## State Management

### Local Component State
- Use React's `useState` and `useReducer` hooks for component-local state

### Global State
- Use Legend State for global application state
- Example:

```typescript
import { observable } from '@legendapp/state';

export const appState = observable({
  user: {
    id: '',
    name: '',
    isAuthenticated: false
  },
  workouts: [],
  settings: {
    theme: 'light',
    notifications: true
  }
});
```

## Data Fetching

- Use React Query for data fetching, caching, and synchronization
- Create custom hooks for each API endpoint

```typescript
// use-get-workouts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '~/services/api';

export function useGetWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.getWorkouts()
  });
}
```

## Navigation

- Use Expo Router for navigation
- Structure routes in the `app/` directory following the file-based routing pattern

## Styling

- Use NativeWind (Tailwind CSS) for styling components
- Use the `cn` utility for conditional class names

```typescript
<View className={cn(
  "p-4 rounded-lg", 
  isActive ? "bg-blue-500" : "bg-gray-300"
)}>
  <Text className="text-white">Content</Text>
</View>
```

## Form Handling

- Use React Hook Form with Zod validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  reps: z.number().min(1)
});

export function WorkoutForm() {
  const { register, handleSubmit, errors } = useForm({
    resolver: zodResolver(schema)
  });
  
  const onSubmit = (data) => {
    // Process form data
  };
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </Form>
  );
}
``` 