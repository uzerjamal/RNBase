import { createMMKV } from 'react-native-mmkv';

import { appStorage } from './storage';

const mockCreateMMKV = createMMKV as jest.MockedFunction<typeof createMMKV>;

describe('appStorage', () => {
  const mockStorage = mockCreateMMKV.mock.results[0]?.value as {
    set: jest.Mock;
    getString: jest.Mock;
    remove: jest.Mock;
    clearAll: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns validated value when key exists', () => {
      const parsed = { id: 1 };
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(parsed));
      const result = appStorage.get<{ id: number }>('key', (d) => d as { id: number });
      expect(result).toEqual(parsed);
    });

    it('returns null when key does not exist', () => {
      mockStorage.getString.mockReturnValueOnce(undefined);
      const result = appStorage.get('key', (d) => d);
      expect(result).toBeNull();
    });

    it('returns null when validate throws', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify('invalid'));
      const result = appStorage.get('key', () => {
        throw new Error('bad value');
      });
      expect(result).toBeNull();
    });

    it('returns null on parse error', () => {
      mockStorage.getString.mockReturnValueOnce('invalid json {{{');
      const result = appStorage.get('key', (d) => d);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('stores JSON stringified value', () => {
      appStorage.set('key', { id: 1 });
      expect(mockStorage.set).toHaveBeenCalledWith('key', JSON.stringify({ id: 1 }));
    });
  });

  describe('delete', () => {
    it('calls remove on storage', () => {
      appStorage.delete('key');
      expect(mockStorage.remove).toHaveBeenCalledWith('key');
    });
  });

  describe('clear', () => {
    it('calls clearAll on storage', () => {
      appStorage.clear();
      expect(mockStorage.clearAll).toHaveBeenCalled();
    });
  });
});
