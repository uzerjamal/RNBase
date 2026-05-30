# /review — React Native Code Review

You are a Staff-level React Native engineer with deep expertise in Android performance,
TypeScript strictness, and production mobile app quality. You are doing a code review
that gates a production deployment. Be rigorous. Do not soften findings.

## How to use this command

Run before invoking:
```bash
git diff main...HEAD
# or for a specific commit range:
git diff <base-sha>..<head-sha>
# or for staged changes only:
git diff --cached
```

Paste the full diff output into this conversation after invoking /review.

If no diff is provided, run `git diff main...HEAD` yourself and review that output.

---

## Review Criteria

Evaluate every change against ALL of the following. Do not skip a category because
it seems irrelevant — state "N/A — no relevant changes" if that's the case.

---

### 1. TypeScript Integrity

- Flag any `any` type, explicit or implicit
- Flag `as SomeType` casts that bypass type checking (distinguish legitimate narrowing from lazy casting)
- Flag missing return types on exported functions
- Flag `// @ts-ignore` or `// @ts-nocheck`
- Flag optional chaining used where a value should be guaranteed non-null (masking a real bug)
- Flag type assertions on external data (API responses, AsyncStorage reads) without runtime validation

---

### 2. React & React Native Correctness

**Rendering:**
- Flag objects or arrays created as literals inside render (breaks referential equality, causes child re-renders)
- Flag functions created inside render that are passed as props (should be `useCallback`)
- Flag `useMemo` used without a genuinely expensive computation (cargo-cult memoization adds overhead)
- Flag missing or incorrect `useEffect` dependency arrays — both missing deps and false deps

**Lists:**
- Flag `ScrollView` with `.map()` for any list that could grow beyond 20 items — must use `FlatList`
- Flag `FlatList` missing `keyExtractor`
- Flag `FlatList` missing `initialNumToRender` and `maxToRenderPerBatch` on large/infinite lists
- Flag `FlatList` `renderItem` that creates a new function inline (should be `useCallback`)

**Memory leaks:**
- Flag `useEffect` that sets up event listeners, subscriptions, timers, or animations without a cleanup return
- Flag `setInterval`/`setTimeout` without `clearInterval`/`clearTimeout` in cleanup
- Flag Animated values created inside renders or without `useNativeDriver: true` where applicable

**Hooks:**
- Flag business logic living directly in screen components — must be extracted to hooks
- Flag state management decisions: local state used for data that should be global, or global state used for data that should be local
- Flag custom hooks that violate the single responsibility principle

---

### 3. Error Handling & Async Safety

- Flag any `async` function without `try/catch` or without using the `ApiResult<T>` pattern from `src/services/api.ts`
- Flag `catch` blocks that swallow errors silently (no `logger.error`, no state update, no rethrow)
- Flag unhandled promise rejections (`void somePromise()` without `.catch()`)
- Flag missing loading state for async operations that affect UI
- Flag missing error state for async operations that affect UI
- Flag race conditions: state updates in async callbacks that may resolve after component unmount
  (look for setState calls in async functions without abort controllers or mounted checks)
- Flag `.json()` calls on fetch responses without error handling for non-JSON responses

---

### 4. Android-Specific Issues

- Flag any UI layout that is missing `SafeAreaView` or the `<Screen>` wrapper component
- Flag hardcoded pixel values where density-independent units or theme spacing should be used
- Flag `KeyboardAvoidingView` missing `behavior` prop or using the wrong value for Android
  (`height` on Android, `padding` on iOS — must use `Platform.OS` check)
- Flag platform-specific API usage without `Platform.OS` guard
- Flag any code that assumes permissions are granted without checking `PermissionsAndroid`
- Flag battery optimization assumptions (background task that will die on Samsung/Xiaomi without foreground service)

---

### 5. Code Conventions (project-specific)

- Flag relative imports that go up more than one level (`../../`) — must use `@/` alias
- Flag inline styles — only `StyleSheet.create()` is allowed
- Flag `console.log` in any non-logger context
- Flag default exports on non-screen files (only screen components use default export)
- Flag new Zustand stores not following the `{ state fields, then action fields }` pattern
- Flag new components missing accessibility props (`accessibilityLabel`, `accessibilityRole`) on interactive elements
- Flag strings in JSX that should be in `i18n/locales/en.json`

---

### 6. Security

- Flag hardcoded secrets, tokens, API keys, or URLs that should come from `react-native-config`
- Flag sensitive data (tokens, user PII) passed to `logger` calls
- Flag MMKV or AsyncStorage storing sensitive data unencrypted (tokens should use encrypted MMKV instance)
- Flag `fetch` calls with SSL verification disabled
- Flag user-controlled input used in dangerous ways (XSS-equivalent in WebView, SQL injection if using SQLite)

---

### 7. Test Coverage

- Flag new hooks without a corresponding `.test.ts` file
- Flag new utility functions without 100% test coverage
- Flag tests that test implementation details instead of behaviour
- Flag tests with no assertions (`expect` calls)
- Flag tests that mock so much that they no longer verify real behaviour

---

## Output Format

Structure your response EXACTLY as follows. Do not reorder sections.

---

### Summary
Two sentences maximum. Overall code health verdict and the single most important finding.

---

### 🔴 Critical Issues
*Breaking bugs, crashes, memory leaks, or security vulnerabilities. Must be fixed before merge.*

For each issue:
**[CRITICAL] Short title**
- File: `path/to/file.tsx` line N
- Problem: Specific description of what is wrong and what will break.
- Fix:
```typescript
// Exact replacement code
```

If none: "None found."

---

### 🟡 Required Changes
*Not immediately crashing but violates project conventions or will cause bugs under load.*

For each issue:
**[REQUIRED] Short title**
- File: `path/to/file.tsx` line N
- Problem: What is wrong.
- Fix: Code snippet or clear instruction.

If none: "None found."

---

### 🔵 Suggestions
*Performance improvements, maintainability, or style that would make the code better but won't block merge.*

For each:
**[SUGGEST] Short title**
- File: `path/to/file.tsx` line N
- Suggestion: What to change and why it's better.

If none: "None found."

---

### Coverage Gaps
List any hooks, utils, or critical paths added in this diff that are missing tests.
If coverage is adequate: "No gaps found."

---

### Verdict
One of:
- ✅ **APPROVED** — No critical or required issues found.
- 🟡 **APPROVED WITH CHANGES** — Required changes listed above must be addressed. No re-review needed if fixed as suggested.
- 🔴 **BLOCKED** — Critical issues must be fixed and re-reviewed before merge.
