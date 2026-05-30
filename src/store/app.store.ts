import { create } from 'zustand';

import { appStorage } from '@/services/storage';
import type { AppColors } from '@/theme/colors';
import { lightColors, darkColors } from '@/theme/colors';

type Theme = 'light' | 'dark' | 'system';

interface AppStore {
  // State
  theme: Theme;
  colors: AppColors;
  isHydrated: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  hydrate: () => void;
}

const THEME_KEY = 'app:theme';

export const useAppStore = create<AppStore>()((set) => ({
  theme: 'system',
  colors: lightColors,
  isHydrated: false,

  setTheme: (theme: Theme): void => {
    appStorage.set(THEME_KEY, theme);
    set({
      theme,
      colors: theme === 'dark' ? darkColors : lightColors,
    });
  },

  hydrate: (): void => {
    const savedTheme = appStorage.get<Theme>(THEME_KEY);
    if (savedTheme) {
      set({
        theme: savedTheme,
        colors: savedTheme === 'dark' ? darkColors : lightColors,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
