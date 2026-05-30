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

  it('renders secondary variant', () => {
    render(<Button label="Secondary" variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('renders ghost variant', () => {
    render(<Button label="Ghost" variant="ghost" />);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });

  it('renders destructive variant', () => {
    render(<Button label="Danger" variant="destructive" />);
    expect(screen.getByText('Danger')).toBeTruthy();
  });

  it('renders full width', () => {
    render(<Button label="Full" fullWidth />);
    expect(screen.getByText('Full')).toBeTruthy();
  });

  it('renders small size', () => {
    render(<Button label="Small" size="sm" />);
    expect(screen.getByText('Small')).toBeTruthy();
  });

  it('renders large size', () => {
    render(<Button label="Large" size="lg" />);
    expect(screen.getByText('Large')).toBeTruthy();
  });
});
