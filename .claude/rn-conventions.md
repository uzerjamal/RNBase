# React Native Code Conventions

## TypeScript

- Strict mode. No `any`, no `as unknown as X` tricks.
- `interface` for object shapes. `type` for unions, intersections, aliases.
- Explicit return types on all exported functions.
- `SCREAMING_SNAKE_CASE` for constants. `PascalCase` for components/types. `camelCase` for everything else.

## Components

```typescript
// Props always named [ComponentName]Props
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

// StyleSheet.create — always. Never inline styles.
const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

## Hooks

All business logic lives in hooks. Screens are dumb — they call hooks and render output.

```typescript
// Return typed object, not tuple (unless state + setter pair)
function useAlarms() {
  return { alarms, isLoading, error, addAlarm, removeAlarm };
}
```

## State (Zustand)

```typescript
interface FeatureStore {
  // State first, actions second
  items: Item[];
  isLoading: boolean;
  error: string | null;
  // Actions
  setItems: (items: Item[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}
```

## Error Handling

```typescript
import { logger } from '@/utils/logger';

try {
  await doSomething();
} catch (error) {
  logger.error('Context: what failed and why it matters', error);
  // Then: rethrow, set error state, or show user-facing message
}
// Never swallow errors silently.
```

## Imports

```typescript
// Always absolute via @/ — never ../../../
import { Button } from '@/components/Button';
import { useAlarmStore } from '@/store/alarm.store';
```

## Performance

- `useCallback` for functions passed as props
- `useMemo` for expensive computations only — not everything
- `FlatList` for any list that can exceed 20 items
- No object or function creation inside render
