import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type PressableProps,
} from 'react-native';

import { Text } from '@/components/Text';
import { useAppStore } from '@/store/app.store';
import type { AppColors } from '@/theme/colors';
import { borderRadius, spacing } from '@/theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: object;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  onPress,
  style,
  ...rest
}: ButtonProps): React.JSX.Element {
  const colors = useAppStore((s) => s.colors);
  const isDisabled = disabled === true || loading;

  const handlePress = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (!isDisabled && onPress) {
        onPress(event);
      }
    },
    [isDisabled, onPress],
  );

  const variantStyle = useMemo<ViewStyle>(
    () => getVariantStyle(variant, colors),
    [variant, colors],
  );

  const containerStyle = useMemo(
    () => [
      styles.base,
      sizeStyles[size],
      variantStyle,
      isDisabled && styles.disabled,
      fullWidth && styles.fullWidth,
      style,
    ],
    [variantStyle, size, isDisabled, fullWidth, style],
  );

  return (
    <Pressable
      style={({ pressed }) => [...containerStyle, pressed && !isDisabled && styles.pressed]}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.text.inverse : colors.primary}
          size="small"
        />
      ) : (
        <Text
          variant="label"
          color={variant === 'primary' || variant === 'destructive' ? 'inverse' : 'primary'}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function getVariantStyle(variant: ButtonVariant, colors: AppColors): ViewStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary };
    case 'secondary':
      return { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border };
    case 'ghost':
      return { backgroundColor: colors.transparent };
    case 'destructive':
      return { backgroundColor: colors.error };
  }
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing[2], paddingHorizontal: spacing[3] },
  md: { paddingVertical: spacing[3], paddingHorizontal: spacing[4] },
  lg: { paddingVertical: spacing[4], paddingHorizontal: spacing[6] },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85 },
});
