export const palette = {
  // Base
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Neutrals
  neutral50: '#FAFAFA',
  neutral100: '#F5F5F5',
  neutral200: '#E5E5E5',
  neutral300: '#D4D4D4',
  neutral400: '#A3A3A3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Brand (override per app)
  brand500: '#2563EB',
  brand600: '#1D4ED8',
  brand400: '#3B82F6',

  // Semantic
  red500: '#EF4444',
  green500: '#22C55E',
  yellow500: '#EAB308',
} as const;

export interface AppColors {
  primary: string;
  primaryHover: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  transparent: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  error: string;
  success: string;
  warning: string;
}

export const lightColors: AppColors = {
  primary: palette.brand500,
  primaryHover: palette.brand600,
  background: palette.white,
  surface: palette.neutral50,
  surfaceElevated: palette.white,
  border: palette.neutral200,
  transparent: palette.transparent,
  text: {
    primary: palette.neutral900,
    secondary: palette.neutral500,
    disabled: palette.neutral300,
    inverse: palette.white,
  },
  error: palette.red500,
  success: palette.green500,
  warning: palette.yellow500,
};

export const darkColors: AppColors = {
  primary: palette.brand400,
  primaryHover: palette.brand500,
  background: palette.neutral900,
  surface: palette.neutral800,
  surfaceElevated: palette.neutral700,
  border: palette.neutral700,
  transparent: palette.transparent,
  text: {
    primary: palette.white,
    secondary: palette.neutral400,
    disabled: palette.neutral600,
    inverse: palette.neutral900,
  },
  error: palette.red500,
  success: palette.green500,
  warning: palette.yellow500,
};
