# React Native Production Starter — Build Spec

You are building a production-ready React Native base template from scratch.
This will be committed to GitHub and reused as the starting point for all future apps.
Work completely autonomously. Do not ask for confirmation on anything except deleting files.
If a phase fails verification, fix it before moving to the next phase.

---

## Ground Rules

1. **Package installation:** Always install packages using `npm install <package>` or `npm install --save-dev <package>`. Never add dependencies by editing `package.json` directly — this installs outdated versions.
2. **Verification before commit:** After each phase, run the full verification command. Only commit if it passes.
3. **Full verification command:** `npx tsc --noEmit && npx eslint src/ --ext .ts,.tsx --max-warnings 0 && npx jest --passWithNoTests --ci`
4. **Commit format:** `feat(phase-N): <description>` — commit after each phase passes verification.
5. **Git init on Phase 0** if not already a git repo.
6. **New Architecture:** React Native New Architecture must be enabled.
7. **No shortcuts:** No `// @ts-ignore`, no `any` types, no inline styles, no `console.log`.

---

## Phase 0: Project Bootstrap

```bash
npx react-native@latest init RNBase --template react-native-template-typescript
cd RNBase
git init
git add .
git commit -m "chore: initial react-native init"
```

Confirm Android builds and runs:
```bash
npx react-native run-android
```

If it runs, proceed. If not, fix the build before continuing.

---

## Phase 1: Production Dependencies

Install in this exact order. One group at a time. Confirm each installs without errors.

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Gestures & Animations (required by navigation + future features)
npm install react-native-gesture-handler react-native-reanimated

# State
npm install zustand

# Storage
npm install react-native-mmkv
npm install @react-native-async-storage/async-storage

# Environment config
npm install react-native-config

# Crash reporting
npm install @sentry/react-native

# i18n
npm install react-i18next i18next

# Utilities
npm install react-native-device-info
npm install date-fns
```

After all installs, run:
```bash
npx pod-install  # skip if no iOS, but run if pods exist
```

Commit: `feat(phase-1): install production dependencies`

---

## Phase 2: Dev Tooling Dependencies

```bash
# TypeScript ESLint
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# ESLint plugins
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-react-native
npm install --save-dev eslint-plugin-import eslint-import-resolver-typescript

# Prettier
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Git hooks
npm install --save-dev husky lint-staged

# Commit linting
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Testing
npm install --save-dev @testing-library/react-native @testing-library/jest-native

# Babel path alias (for @/ imports)
npm install --save-dev babel-plugin-module-resolver
```

Commit: `feat(phase-2): install dev tooling dependencies`

---

## Phase 3: Configuration Files

Create each file exactly as specified.

### `tsconfig.json` (replace entirely)
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "index.js", "App.tsx"],
  "exclude": ["node_modules", "android", "ios", "__tests__"]
}
```

### `babel.config.js` (replace entirely)
```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    'react-native-reanimated/plugin', // must be last
  ],
};
```

### `.eslintrc.js` (create)
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'import',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-floating-promises': 'error',

    // React
    'react/react-in-jsx-scope': 'off', // New JSX transform
    'react/prop-types': 'off',         // TypeScript handles this
    'react-hooks/exhaustive-deps': 'error',

    // React Native
    'react-native/no-inline-styles': 'error',
    'react-native/no-unused-styles': 'error',
    'react-native/no-color-literals': 'warn',

    // Imports
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'import/no-relative-parent-imports': 'error',

    // No console
    'no-console': 'error',

    // Prettier
    'prettier/prettier': 'error',
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
    },
  },
  env: {
    'react-native/react-native': true,
  },
};
```

### `.prettierrc` (create)
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### `.prettierignore` (create)
```
node_modules/
android/
ios/
.husky/
*.md
```

### `jest.config.js` (create or replace)
```js
module.exports = {
  preset: 'react-native',
  setupFilesAfterFramework: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['./src/__mocks__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|react-native-mmkv|react-native-config|react-native-device-info|@sentry)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
    '!src/i18n/**',
    '!src/types/**',
    '!src/theme/**',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### `commitlint.config.js` (create)
```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'refactor', 'test', 'docs', 'perf', 'ci', 'revert'],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-max-length': [2, 'always', 72],
  },
};
```

### `.lintstagedrc.js` (create)
```js
module.exports = {
  'src/**/*.{ts,tsx}': [
    'eslint --fix --max-warnings 0',
    'prettier --write',
  ],
  '*.{js,json,md}': ['prettier --write'],
};
```

### Husky setup
```bash
npx husky init
```

Create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

Create `.husky/commit-msg`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx commitlint --edit "$1"
```

Create `.husky/pre-push`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx tsc --noEmit && npx jest --passWithNoTests --ci
```

Make all hooks executable: `chmod +x .husky/*`

Add to `package.json` scripts section (using `npm pkg set`):
```bash
npm pkg set scripts.lint="eslint src/ --ext .ts,.tsx --max-warnings 0"
npm pkg set scripts.lint:fix="eslint src/ --ext .ts,.tsx --fix"
npm pkg set scripts.format="prettier --write 'src/**/*.{ts,tsx}'"
npm pkg set scripts.format:check="prettier --check 'src/**/*.{ts,tsx}'"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.test="jest --passWithNoTests"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage --passWithNoTests"
npm pkg set scripts.validate="tsc --noEmit && eslint src/ --ext .ts,.tsx --max-warnings 0 && jest --passWithNoTests --ci"
npm pkg set scripts.prepare="husky"
```

Run `npm run validate`. Fix all errors before proceeding.

Commit: `feat(phase-3): configure typescript, eslint, prettier, jest, husky, commitlint`

---

## Phase 4: Folder Structure

Create the following directory tree under `src/`:

```
src/
├── __mocks__/
├── components/
│   ├── Button/
│   ├── Screen/
│   └── Text/
├── hooks/
├── i18n/
│   └── locales/
├── navigation/
│   └── stacks/
├── screens/
│   └── Home/
├── services/
├── store/
├── theme/
├── types/
└── utils/
```

```bash
mkdir -p src/__mocks__ src/components/Button src/components/Screen src/components/Text
mkdir -p src/hooks src/i18n/locales src/navigation/stacks
mkdir -p src/screens/Home src/services src/store src/theme src/types src/utils
```

Commit: `chore(phase-4): create folder structure`

---

## Phase 5: Mocks Setup

### `src/__mocks__/setup.ts`
```typescript
// React Native modules that need mocking in tests
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

jest.mock('react-native-config', () => ({
  API_BASE_URL: 'https://api.test.com',
  SENTRY_DSN: '',
  ENV: 'test',
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  wrap: (component: unknown) => component,
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getDeviceId: jest.fn(() => 'test-device'),
  isEmulator: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));
```

Commit: `feat(phase-5): add jest mocks`

---

## Phase 6: Theme System

### `src/theme/colors.ts`
```typescript
export const palette = {
  // Base
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Neutrals
  neutral50: '#FAFAFA',
  neutral100: '#F5F5F5',
  neutral200: '#E5E5E5',
  neutral300: '#D4D4D4',
  neutral400: '#A3A3A3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Brand (override per app)
  brand500: '#2563EB',
  brand600: '#1D4ED8',
  brand400: '#3B82F6',

  // Semantic
  red500: '#EF4444',
  green500: '#22C55E',
  yellow500: '#EAB308',
} as const;

export const lightColors = {
  primary: palette.brand500,
  primaryHover: palette.brand600,
  background: palette.white,
  surface: palette.neutral50,
  surfaceElevated: palette.white,
  border: palette.neutral200,
  text: {
    primary: palette.neutral900,
    secondary: palette.neutral500,
    disabled: palette.neutral300,
    inverse: palette.white,
  },
  error: palette.red500,
  success: palette.green500,
  warning: palette.yellow500,
} as const;

export const darkColors: typeof lightColors = {
  primary: palette.brand400,
  primaryHover: palette.brand500,
  background: palette.neutral900,
  surface: palette.neutral800,
  surfaceElevated: palette.neutral700,
  border: palette.neutral700,
  text: {
    primary: palette.white,
    secondary: palette.neutral400,
    disabled: palette.neutral600,
    inverse: palette.neutral900,
  },
  error: palette.red500,
  success: palette.green500,
  warning: palette.yellow500,
} as const;

export type AppColors = typeof lightColors;
```

### `src/theme/typography.ts`
```typescript
import { Platform } from 'react-native';

export const fontFamily = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif' }),
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  semibold: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  bold: Platform.select({ ios: 'System', android: 'sans-serif' }),
  mono: Platform.select({ ios: 'Courier', android: 'monospace' }),
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
```

### `src/theme/spacing.ts`
```typescript
// 4pt base grid
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
```

### `src/theme/index.ts`
```typescript
export * from './colors';
export * from './typography';
export * from './spacing';
```

Commit: `feat(phase-6): implement theme system`

---

## Phase 7: Utilities

### `src/utils/logger.ts`
```typescript
import * as Sentry from '@sentry/react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = __DEV__;

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    const consoleFn = level === 'error' ? console.error
      : level === 'warn' ? console.warn
      : console.log;
    consoleFn(`[${level.toUpperCase()}] ${message}`, ...args);
  }

  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level,
    data: args.length > 0 ? { args } : undefined,
  });
}

export const logger = {
  debug: (message: string, ...args: unknown[]): void => log('debug', message, ...args),
  info: (message: string, ...args: unknown[]): void => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]): void => log('warn', message, ...args),
  error: (message: string, error?: unknown): void => {
    log('error', message, error);
    if (error instanceof Error) {
      Sentry.captureException(error);
    }
  },
};
```

### `src/utils/logger.test.ts`
```typescript
import * as Sentry from '@sentry/react-native';

import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds breadcrumb on info', () => {
    logger.info('test message');
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'info', message: 'test message' }),
    );
  });

  it('captures exception on error with Error instance', () => {
    const error = new Error('test error');
    logger.error('something failed', error);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('does not capture exception for non-Error values', () => {
    logger.error('something failed', 'string error');
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
```

### `src/utils/index.ts`
```typescript
export * from './logger';
```

Commit: `feat(phase-7): add logger utility with tests`

---

## Phase 8: Services

### `src/services/storage.ts`
```typescript
import { MMKV } from 'react-native-mmkv';

import { logger } from '@/utils/logger';

const storage = new MMKV({ id: 'app-storage' });

export const appStorage = {
  get<T>(key: string): T | null {
    try {
      const value = storage.getString(key);
      if (value === undefined) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`storage.get failed for key: ${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      logger.error(`storage.set failed for key: ${key}`, error);
    }
  },

  delete(key: string): void {
    try {
      storage.delete(key);
    } catch (error) {
      logger.error(`storage.delete failed for key: ${key}`, error);
    }
  },

  clear(): void {
    try {
      storage.clearAll();
    } catch (error) {
      logger.error('storage.clear failed', error);
    }
  },
};
```

### `src/services/api.ts`
```typescript
import Config from 'react-native-config';

import { logger } from '@/utils/logger';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

const BASE_URL = Config.API_BASE_URL ?? '';
const DEFAULT_TIMEOUT = 10_000;

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeout ?? DEFAULT_TIMEOUT,
  );

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: (errorBody as { message?: string }).message ?? response.statusText,
        status: response.status,
        code: (errorBody as { code?: string }).code,
      };
      logger.warn(`API ${method} ${path} failed`, error);
      return { success: false, error };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      const error: ApiError = { message: 'Request timed out', status: 0 };
      logger.error(`API ${method} ${path} timed out`);
      return { success: false, error };
    }

    const error: ApiError = {
      message: err instanceof Error ? err.message : 'Unknown error',
      status: 0,
    };
    logger.error(`API ${method} ${path} threw`, err);
    return { success: false, error };
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResult<T>> =>
    request<T>('PATCH', path, body, options),

  delete: <T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> =>
    request<T>('DELETE', path, undefined, options),
};
```

### `src/services/api.test.ts`
```typescript
import { api } from './api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success result on 200', async () => {
    const data = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    const result = await api.get('/test');
    expect(result).toEqual({ success: true, data });
  });

  it('returns error result on non-200', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Resource not found' }),
    });

    const result = await api.get('/test');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.status).toBe(404);
    }
  });

  it('returns error result on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await api.get('/test');
    expect(result.success).toBe(false);
  });

  it('sends body on POST', async () => {
    const body = { name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    await api.post('/test', body);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
      }),
    );
  });
});
```

Commit: `feat(phase-8): add storage and api services with tests`

---

## Phase 9: i18n

### `src/i18n/locales/en.json`
```json
{
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
    "error": "Something went wrong",
    "retry": "Retry",
    "loading": "Loading..."
  }
}
```

### `src/i18n/index.ts`
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

const resources = {
  en: { translation: en },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
```

Commit: `feat(phase-9): add i18n setup`

---

## Phase 10: State Management

### `src/store/app.store.ts`
```typescript
import { create } from 'zustand';

import { appStorage } from '@/services/storage';
import { lightColors, darkColors } from '@/theme/colors';
import type { AppColors } from '@/theme/colors';

type Theme = 'light' | 'dark' | 'system';

interface AppStore {
  // State
  theme: Theme;
  colors: AppColors;
  isHydrated: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  hydrate: () => void;
}

const THEME_KEY = 'app:theme';

export const useAppStore = create<AppStore>()((set) => ({
  theme: 'system',
  colors: lightColors,
  isHydrated: false,

  setTheme: (theme: Theme): void => {
    appStorage.set(THEME_KEY, theme);
    set({
      theme,
      colors: theme === 'dark' ? darkColors : lightColors,
    });
  },

  hydrate: (): void => {
    const savedTheme = appStorage.get<Theme>(THEME_KEY);
    if (savedTheme) {
      set({
        theme: savedTheme,
        colors: savedTheme === 'dark' ? darkColors : lightColors,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
```

### `src/store/app.store.test.ts`
```typescript
import { useAppStore } from './app.store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      theme: 'system',
      isHydrated: false,
    });
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { theme, isHydrated } = useAppStore.getState();
    expect(theme).toBe('system');
    expect(isHydrated).toBe(false);
  });

  it('sets theme to dark', () => {
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('sets theme to light', () => {
    useAppStore.getState().setTheme('light');
    expect(useAppStore.getState().theme).toBe('light');
  });

  it('hydrate sets isHydrated to true', () => {
    useAppStore.getState().hydrate();
    expect(useAppStore.getState().isHydrated).toBe(true);
  });
});
```

Commit: `feat(phase-10): add zustand app store with tests`

---

## Phase 11: Base Components

### `src/components/Screen/Screen.tsx`
```typescript
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore } from '@/store/app.store';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  unsafe?: boolean; // bypass SafeAreaView
}

export function Screen({ children, unsafe = false, style, ...rest }: ScreenProps): React.JSX.Element {
  const colors = useAppStore((s) => s.colors);
  const Wrapper = unsafe ? View : SafeAreaView;

  return (
    <Wrapper
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...rest}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### `src/components/Screen/index.ts`
```typescript
export { Screen } from './Screen';
```

### `src/components/Text/Text.tsx`
```typescript
import React from 'react';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { useAppStore } from '@/store/app.store';
import { fontSize, fontWeight, fontFamily } from '@/theme/typography';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
type TextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | 'error';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, object> = {
  h1: { fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, fontFamily: fontFamily.bold },
  h2: { fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, fontFamily: fontFamily.bold },
  h3: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, fontFamily: fontFamily.semibold },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, fontFamily: fontFamily.regular },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, fontFamily: fontFamily.regular },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, fontFamily: fontFamily.medium },
};

export function Text({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}: TextProps): React.JSX.Element {
  const colors = useAppStore((s) => s.colors);
  const textColor = color === 'error' ? colors.error : colors.text[color];

  return (
    <RNText
      style={[styles.base, variantStyles[variant], { color: textColor }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
```

### `src/components/Text/index.ts`
```typescript
export { Text } from './Text';
```

### `src/components/Button/Button.tsx`
```typescript
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';

import { useAppStore } from '@/store/app.store';
import { spacing, borderRadius } from '@/theme/spacing';
import { Text } from '../Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  onPress,
  ...rest
}: ButtonProps): React.JSX.Element {
  const colors = useAppStore((s) => s.colors);
  const isDisabled = disabled === true || loading;

  const handlePress = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (!isDisabled && onPress) {
        onPress(event);
      }
    },
    [isDisabled, onPress],
  );

  const containerStyle = [
    styles.base,
    sizeStyles[size],
    getVariantStyle(variant, colors),
    isDisabled && styles.disabled,
    fullWidth && styles.fullWidth,
  ];

  return (
    <Pressable
      style={({ pressed }) => [...containerStyle, pressed && !isDisabled && styles.pressed]}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.text.inverse : colors.primary}
          size="small"
        />
      ) : (
        <Text
          variant="label"
          color={variant === 'primary' || variant === 'destructive' ? 'inverse' : 'primary'}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function getVariantStyle(
  variant: ButtonVariant,
  colors: ReturnType<typeof useAppStore.getState>['colors'],
): object {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary };
    case 'secondary':
      return { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border };
    case 'ghost':
      return { backgroundColor: colors.transparent };
    case 'destructive':
      return { backgroundColor: colors.error };
  }
}

const sizeStyles: Record<ButtonSize, object> = {
  sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3] },
  md: { paddingVertical: spacing[3], paddingHorizontal: spacing[4] },
  lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[6] },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
  fullWidth: { alignSelf: 'stretch' },
});
```

### `src/components/Button/index.ts`
```typescript
export { Button } from './Button';
```

### `src/components/Button/Button.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { Button } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Press me" />);
    expect(screen.getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button label="Press me" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Press me" onPress={onPress} disabled />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    render(<Button label="Press me" loading />);
    expect(screen.queryByText('Press me')).toBeNull();
    expect(screen.getByRole('button')).toHaveAccessibilityState({ busy: true });
  });
});
```

### `src/components/index.ts`
```typescript
export { Button } from './Button';
export { Screen } from './Screen';
export { Text } from './Text';
```

Commit: `feat(phase-11): add base component library (Screen, Text, Button) with tests`

---

## Phase 12: Navigation

### `src/navigation/types.ts`
```typescript
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  // Add screens here as you build the app
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
```

### `src/navigation/RootNavigator.tsx`
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HomeScreen } from '@/screens/Home';
import { useAppStore } from '@/store/app.store';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const colors = useAppStore((s) => s.colors);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text.primary,
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### `src/navigation/index.ts`
```typescript
export { RootNavigator } from './RootNavigator';
export type { RootStackParamList } from './types';
```

Commit: `feat(phase-12): add navigation setup`

---

## Phase 13: Home Screen

### `src/screens/Home/index.tsx`
```typescript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Screen, Text } from '@/components';
import { useAppStore } from '@/store/app.store';
import { spacing } from '@/theme/spacing';

export default function HomeScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const { theme, setTheme } = useAppStore();

  function handleToggleTheme(): void {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h2">RNBase Starter</Text>
        <Text variant="body" color="secondary" style={styles.subtitle}>
          Production-ready React Native template
        </Text>
        <Button
          label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'}`}
          onPress={handleToggleTheme}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

// Named export for testing
export { HomeScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[4],
  },
  subtitle: {
    textAlign: 'center',
  },
  button: {
    marginTop: spacing[4],
  },
});
```

Commit: `feat(phase-13): add home screen`

---

## Phase 14: Wire Up App.tsx

Replace `App.tsx` entirely:

```typescript
import './src/i18n';

import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Config from 'react-native-config';

import { RootNavigator } from '@/navigation';
import { useAppStore } from '@/store/app.store';

Sentry.init({
  dsn: Config.SENTRY_DSN ?? '',
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
});

function App(): React.JSX.Element {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
```

Create `.env` file (gitignored):
```
API_BASE_URL=https://api.example.com
SENTRY_DSN=
ENV=development
```

Create `.env.example` (committed):
```
API_BASE_URL=https://api.example.com
SENTRY_DSN=
ENV=development
```

Add `.env` to `.gitignore`.

Commit: `feat(phase-14): wire up App.tsx with Sentry, i18n, navigation`

---

## Phase 15: Final Verification

Run the full suite. Fix every error before committing.

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npx eslint src/ --ext .ts,.tsx --max-warnings 0

# 3. Format check
npx prettier --check "src/**/*.{ts,tsx}"

# 4. Tests with coverage
npx jest --coverage --passWithNoTests

# 5. Android build
npx react-native run-android
```

All must pass. Then:

```bash
git add .
git commit -m "chore(phase-15): final validation — all checks pass"
```

---

## Completion Criteria

The task is complete only when ALL of the following are true:

- [ ] `npx tsc --noEmit` exits with code 0
- [ ] `npx eslint src/ --ext .ts,.tsx --max-warnings 0` exits with code 0
- [ ] `npx jest --coverage --passWithNoTests` exits with code 0 with ≥70% coverage
- [ ] `npx prettier --check "src/**/*.{ts,tsx}"` exits with code 0
- [ ] Android app builds and renders HomeScreen
- [ ] Husky pre-commit hook fires and blocks commits with lint errors
- [ ] `@/` path aliases resolve correctly in both TS and Jest
- [ ] All 15 phases committed with correct commit message format
- [ ] `.env` is gitignored, `.env.example` is committed
- [ ] No `any`, no `console.log`, no inline styles anywhere in `src/`

---

## Notes

- Project name is `RNBase`. When using this as a template for a real app, rename with:
  `npx react-native-rename <NewAppName>` or manually find-replace `RNBase` in the codebase.
- iOS not configured. If adding iOS later, run `npx pod-install` and add required native setup per library.
- Sentry DSN intentionally blank. Add real DSN in `.env` per app.
- `react-native-config` requires a rebuild (`npx react-native run-android`) after changing `.env`.
