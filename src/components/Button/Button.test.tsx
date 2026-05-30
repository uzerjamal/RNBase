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
