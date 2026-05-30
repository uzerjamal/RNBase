import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { Screen } from './Screen';

describe('Screen', () => {
  it('renders children in SafeAreaView by default', () => {
    const { getByText } = render(
      <Screen>
        <Text>Hello</Text>
      </Screen>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders in plain View when unsafe=true', () => {
    const { getByText } = render(
      <Screen unsafe>
        <Text>Hello</Text>
      </Screen>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });
});
