import React, { useMemo } from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextStyle,
  type TextProps as RNTextProps,
} from 'react-native';

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
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
  },
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

  const dynamicTextStyle = useMemo<TextStyle>(() => ({ color: textColor }), [textColor]);

  return (
    <RNText style={[styles.base, variantStyles[variant], dynamicTextStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
