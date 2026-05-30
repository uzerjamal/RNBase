# CLAUDE.md

React Native base template. Android-first. TypeScript strict. Zero-bloat.

## Commands

```bash
npx react-native start              # Metro bundler
npx react-native run-android        # Run on device/emulator
npx tsc --noEmit                    # Type check (must pass 0 errors)
npx eslint src/ --ext .ts,.tsx --fix # Lint + auto-fix
npx prettier --write "src/**/*.{ts,tsx}" # Format
npx jest --passWithNoTests          # Tests

# Full validation — run before reporting any task complete
npx tsc --noEmit && npx eslint src/ --ext .ts,.tsx && npx jest --passWithNoTests
```

## Tech Stack

- React Native 0.76+ with New Architecture enabled
- TypeScript strict mode
- React Navigation v7 (stack + bottom tabs)
- Zustand for state — no Redux, no Context for global state
- MMKV for fast key-value storage
- AsyncStorage for large blobs only
- react-native-config for .env vars
- @sentry/react-native for crash reporting
- react-i18next for i18n
- Jest + React Native Testing Library

**Do NOT introduce:**
- Redux, MobX, or any state lib other than Zustand
- Axios — use the typed fetch wrapper in `src/services/api.ts`
- Any UI component library (NativeBase, Tamagui, etc.)
- `any` TypeScript type
- `console.log` — use `src/utils/logger.ts`
- Inline styles — use `StyleSheet.create()` always
- Class components
- `// @ts-ignore` or `// @ts-nocheck`

## Project Structure

```
src/
├── components/       # Shared UI primitives (Button, Text, Screen)
├── screens/          # One file per screen
├── navigation/       # RootNavigator, stacks, param types
├── hooks/            # All business logic lives here
├── store/            # Zustand stores — one file per domain
├── services/         # api.ts (fetch wrapper), storage.ts
├── utils/            # Pure functions, logger
├── theme/            # colors, typography, spacing
├── types/            # Global TypeScript types
├── i18n/             # Translations
└── App.tsx
```

**Where new files go:**
- New screen → `src/screens/FeatureName/index.tsx`
- New reusable component → `src/components/ComponentName.tsx`
- Business logic → `src/hooks/useFeatureName.ts`
- Global state → `src/store/featureName.store.ts`
- API call → `src/services/api.ts` or a feature-specific service file
- Type used in >1 file → `src/types/`

## Conventions

- Named exports for everything except screen components (React Navigation requires default export on screens)
- Absolute imports via `@/` alias — never `../../../`
- `interface` for object shapes, `type` for unions
- `useCallback` for functions passed as props, `useMemo` for expensive computations only
- `FlatList` for any list that can exceed 20 items — never `ScrollView` with `.map()`
- Every screen wrapped in `<Screen>` component

## Autonomous Workflow

When given a task:
1. **Explore** — read relevant files before writing anything
2. **Plan** — state what you'll do in bullet points
3. **Implement** — write the code
4. **Verify** — run type check and tests
5. **Lint** — fix all lint errors
6. **Report** — summarize what changed and any limitations

**Do automatically without being asked:**
- Run `npx tsc --noEmit` after editing TypeScript files
- Run `npx jest --passWithNoTests` after changing logic
- Handle loading, error, and empty states in every async UI component
- Add TypeScript types — never use `any`
- Create test files for new hooks and utils

**Ask before doing:**
- Deleting files
- Changing navigation structure
- Installing new dependencies

**Never ask about:**
- Code style (follow this file)
- File placement (follow structure above)
- Whether to add types (always yes)
- Whether to handle errors (always yes)

## Definition of Done

A task is NOT done until:
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npx eslint src/ --ext .ts,.tsx` passes with 0 errors
- [ ] `npx jest --passWithNoTests` passes
- [ ] No `console.log` in committed code
- [ ] No `any` types introduced
- [ ] All imports use `@/` alias
