jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn().mockReturnValue({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  }),
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
  wrap: (component: unknown): unknown => component,
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getDeviceId: jest.fn(() => 'test-device'),
  isEmulator: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-return
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-i18next', () => ({
  useTranslation: (): { t: (key: string) => string; i18n: { changeLanguage: jest.Mock } } => ({
    t: (key: string): string => key,
    i18n: { changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));
