import Config from 'react-native-config';
import { createMMKV } from 'react-native-mmkv';

import { logger } from '@/utils/logger';

// ─── Unencrypted storage ─────────────────────────────────────────────────────
// Use for: UI preferences, theme, non-sensitive app state.
const storage = createMMKV({ id: 'app-storage' });

// ─── Encrypted storage ───────────────────────────────────────────────────────
// Use for: auth tokens, user PII, anything sensitive.
//
// IMPORTANT — key management:
// This starter uses an env var as the encryption key for simplicity.
// Production apps MUST derive this key from the system keychain instead:
//   iOS:     Keychain Services via react-native-keychain
//   Android: Android Keystore via react-native-keychain
//
// Example with react-native-keychain:
//   const { password } = await Keychain.getGenericPassword({ service: 'mmkv-key' });
//   createMMKV({ id: 'secure-storage', encryptionKey: password });
//
// Never hardcode the key in source code or commit it in .env to version control.
const encryptionKey = Config.MMKV_ENCRYPTION_KEY;

if (!encryptionKey || encryptionKey === 'change-this-before-production') {
  logger.warn(
    'secureStorage: using default encryption key — set MMKV_ENCRYPTION_KEY in .env before handling real user data',
  );
}

const secureStore = createMMKV({
  id: 'secure-storage',
  encryptionKey: encryptionKey ?? 'fallback-dev-key-do-not-use-in-prod',
});

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

export const secureStorage = {
  get<T>(key: string, validate: (data: unknown) => T): T | null {
    try {
      const value = secureStore.getString(key);
      if (value === undefined) return null;
      return validate(JSON.parse(value));
    } catch (error) {
      logger.error(`secureStorage.get failed for key: ${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      secureStore.set(key, JSON.stringify(value));
    } catch (error) {
      logger.error(`secureStorage.set failed for key: ${key}`, error);
    }
  },

  delete(key: string): void {
    try {
      secureStore.remove(key);
    } catch (error) {
      logger.error(`secureStorage.delete failed for key: ${key}`, error);
    }
  },

  clear(): void {
    try {
      secureStore.clearAll();
    } catch (error) {
      logger.error('secureStorage.clear failed', error);
    }
  },
};
