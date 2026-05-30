import { MMKV } from 'react-native-mmkv';

import { appStorage, secureStorage } from './storage';

const MockMMKV = MMKV as jest.MockedClass<typeof MMKV>;

type MockInstance = {
  set: jest.Mock;
  getString: jest.Mock;
  delete: jest.Mock;
  clearAll: jest.Mock;
};

// storage.ts calls new MMKV() twice at module init.
// mock.results[n].value is the object returned by the mockImplementation factory.
const mockAppStore = MockMMKV.mock.results[0]?.value as MockInstance;
const mockSecureStore = MockMMKV.mock.results[1]?.value as MockInstance;

describe('appStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns validated value when key exists', () => {
      const parsed = { id: 1 };
      mockAppStore.getString.mockReturnValueOnce(JSON.stringify(parsed));
      const result = appStorage.get<{ id: number }>('key', (d) => d as { id: number });
      expect(result).toEqual(parsed);
    });

    it('returns null when key does not exist', () => {
      mockAppStore.getString.mockReturnValueOnce(undefined);
      const result = appStorage.get('key', (d) => d);
      expect(result).toBeNull();
    });

    it('returns null when validate throws', () => {
      mockAppStore.getString.mockReturnValueOnce(JSON.stringify('invalid'));
      const result = appStorage.get('key', () => {
        throw new Error('bad value');
      });
      expect(result).toBeNull();
    });

    it('returns null on parse error', () => {
      mockAppStore.getString.mockReturnValueOnce('invalid json {{{');
      const result = appStorage.get('key', (d) => d);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('stores JSON stringified value', () => {
      appStorage.set('key', { id: 1 });
      expect(mockAppStore.set).toHaveBeenCalledWith('key', JSON.stringify({ id: 1 }));
    });
  });

  describe('delete', () => {
    it('calls delete on storage', () => {
      appStorage.delete('key');
      expect(mockAppStore.delete).toHaveBeenCalledWith('key');
    });
  });

  describe('clear', () => {
    it('calls clearAll on storage', () => {
      appStorage.clear();
      expect(mockAppStore.clearAll).toHaveBeenCalled();
    });
  });
});

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns validated value when key exists', () => {
      mockSecureStore.getString.mockReturnValueOnce(JSON.stringify('abc123'));
      const result = secureStorage.get<string>('token', (d) => d as string);
      expect(result).toBe('abc123');
    });

    it('returns null when key does not exist', () => {
      mockSecureStore.getString.mockReturnValueOnce(undefined);
      const result = secureStorage.get('token', (d) => d);
      expect(result).toBeNull();
    });

    it('returns null on parse error', () => {
      mockSecureStore.getString.mockReturnValueOnce('invalid{{{');
      const result = secureStorage.get('token', (d) => d);
      expect(result).toBeNull();
    });

    it('returns null when validate throws', () => {
      mockSecureStore.getString.mockReturnValueOnce(JSON.stringify('value'));
      const result = secureStorage.get('token', () => {
        throw new Error('invalid');
      });
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('stores JSON stringified value', () => {
      secureStorage.set('token', 'abc123');
      expect(mockSecureStore.set).toHaveBeenCalledWith('token', JSON.stringify('abc123'));
    });
  });

  describe('delete', () => {
    it('calls delete on secureStore', () => {
      secureStorage.delete('token');
      expect(mockSecureStore.delete).toHaveBeenCalledWith('token');
    });
  });

  describe('clear', () => {
    it('calls clearAll on secureStore', () => {
      secureStorage.clear();
      expect(mockSecureStore.clearAll).toHaveBeenCalled();
    });
  });
});
