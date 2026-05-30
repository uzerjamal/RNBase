import React, { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppStore } from '@/store/app.store';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  unsafe?: boolean;
}

export function Screen({
  children,
  unsafe = false,
  style,
  ...rest
}: ScreenProps): React.JSX.Element {
  const colors = useAppStore((s) => s.colors);
  const Wrapper = unsafe ? View : SafeAreaView;

  const dynamicContainerStyle = useMemo<ViewStyle>(
    () => ({ backgroundColor: colors.background }),
    [colors.background],
  );

  return (
    <Wrapper style={[styles.container, dynamicContainerStyle, style]} {...rest}>
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
