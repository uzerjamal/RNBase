import { render } from '@testing-library/react-native';
import React from 'react';

import { Text } from './Text';

describe('Text', () => {
  it('renders body variant by default', () => {
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders with error color', () => {
    const { getByText } = render(<Text color="error">Error</Text>);
    expect(getByText('Error')).toBeTruthy();
  });

  it('renders h1 variant', () => {
    const { getByText } = render(<Text variant="h1">Title</Text>);
    expect(getByText('Title')).toBeTruthy();
  });

  it('renders secondary color', () => {
    const { getByText } = render(<Text color="secondary">Sub</Text>);
    expect(getByText('Sub')).toBeTruthy();
  });
});
