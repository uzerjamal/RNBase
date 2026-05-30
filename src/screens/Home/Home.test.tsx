import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { HomeScreen } from './index';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

describe('HomeScreen', () => {
  it('renders the title', () => {
    render(<HomeScreen />);
    expect(screen.getByText('home.title')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<HomeScreen />);
    expect(screen.getByText('home.subtitle')).toBeTruthy();
  });

  it('shows switchToDark label when in light theme', () => {
    render(<HomeScreen />);
    expect(screen.getByText('home.switchToDark')).toBeTruthy();
  });

  it('toggles theme on button press', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByRole('button'));
    expect(screen.getByText('home.switchToLight')).toBeTruthy();
  });
});
