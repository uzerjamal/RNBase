import { render } from '@testing-library/react-native';
import React from 'react';

import { RootNavigator } from './RootNavigator';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: (): object => ({
    Navigator: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
    Screen: (): null => null,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

describe('RootNavigator', () => {
  it('renders without crashing', () => {
    expect(() => render(<RootNavigator />)).not.toThrow();
  });
});
