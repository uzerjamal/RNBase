/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  useNavigation: jest.fn(),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: (c: unknown) => c,
  addBreadcrumb: jest.fn(),
  captureException: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  SENTRY_DSN: '',
  API_BASE_URL: 'https://api.test.com',
}));

import App from '../App';

test('renders without crashing', () => {
  render(<App />);
});
