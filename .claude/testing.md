# Testing Rules

## What Gets Tests

- Hooks: always. Minimum 80% coverage.
- Utils: always. 100% coverage.
- Screens: critical paths only (happy path + key error state).
- Native modules: mock them, don't test their internals.

## Tooling

- Jest + React Native Testing Library only
- No Enzyme
- Test files colocated: `ComponentName.test.tsx` next to `ComponentName.tsx`

## What to Test

Test behavior, not implementation.

```typescript
// Good — tests what the user experiences
it('disables button while loading', () => {
  render(<Button loading />);
  expect(screen.getByRole('button')).toBeDisabled();
});

// Bad — tests implementation detail
it('sets isLoading state to true', () => {
  const { result } = renderHook(() => useAlarms());
  expect(result.current.isLoading).toBe(false);
  // ... this tells us nothing useful
});
```

## Always Mock

- Native modules (MMKV, Notifee, Camera, etc.)
- `react-native-config`
- `@sentry/react-native`
- Any module under `android/` or `ios/`
- Async Storage

## Running Tests

```bash
npx jest --passWithNoTests           # All tests
npx jest --watch                     # Watch mode
npx jest path/to/file.test.tsx       # Single file
npx jest --coverage --passWithNoTests # With coverage report
```
