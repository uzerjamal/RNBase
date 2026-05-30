import { createMMKV } from 'react-native-mmkv';

import { logger } from '@/utils/logger';

const storage = createMMKV({ id: 'app-storage' });

export const appStorage = {
  get<T>(key: string, validate: (data: unknown) => T): T | null {
    try {
      const value = storage.getString(key);
      if (value === undefined) return null;
      return validate(JSON.parse(value));
    } catch (error) {
      logger.error(`storage.get failed for key: ${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      logger.error(`storage.set failed for key: ${key}`, error);
    }
  },

  delete(key: string): void {
    try {
      storage.remove(key);
    } catch (error) {
      logger.error(`storage.delete failed for key: ${key}`, error);
    }
  },

  clear(): void {
    try {
      storage.clearAll();
    } catch (error) {
      logger.error('storage.clear failed', error);
    }
  },
};
