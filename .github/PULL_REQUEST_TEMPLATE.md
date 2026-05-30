## What does this PR do?

<!-- One paragraph. What changed and why. Link the ticket/issue if one exists. -->

## Type of change

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — no behaviour change
- [ ] `perf` — performance improvement
- [ ] `test` — tests only
- [ ] `chore` — dependencies, config, tooling

## Checklist

### Code quality
- [ ] `npm run validate` passes locally (typecheck + lint + tests)
- [ ] No `any` types introduced
- [ ] No `console.log` left in code
- [ ] No inline styles — `StyleSheet.create()` used throughout
- [ ] All imports use `@/` alias

### Logic & architecture
- [ ] Business logic lives in hooks, not screens
- [ ] Loading state handled for all async operations
- [ ] Error state handled for all async operations
- [ ] Empty/null state handled where relevant
- [ ] No silent error swallowing — logger used for all caught errors

### Performance
- [ ] No objects or functions created inside render
- [ ] `useCallback` used for functions passed as props
- [ ] `FlatList` used for any list that could exceed 20 items
- [ ] No unnecessary `useMemo` (only for genuinely expensive computations)

### Android
- [ ] Tested on a physical device or Android emulator
- [ ] Back button behaviour handled if this screen has custom navigation
- [ ] Permissions requested at runtime if feature needs them (not assumed granted)
- [ ] Works with battery saver enabled (if relevant to feature)

### Tests
- [ ] New hooks have test coverage
- [ ] New utils have test coverage (100%)
- [ ] Critical screen flows have at least one test
- [ ] No tests deleted without justification

### Security
- [ ] No secrets, tokens, or API keys hardcoded
- [ ] Sensitive values come from `.env` via `react-native-config`
- [ ] No PII logged

## Testing instructions

<!-- Step-by-step: how to manually verify this works. Be specific enough that someone unfamiliar with the feature can test it. -->

1.
2.
3.

## Screenshots / recordings

<!-- Android screenshot or screen recording for any UI change. Not optional for visual PRs. -->

## Known limitations / follow-up work

<!-- Anything deliberately left out of this PR. If there's tech debt introduced, call it out. -->
