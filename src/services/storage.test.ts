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
    it('returns parsed value when key exists', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify({ id: 1 }));
      const result = appStorage.get<{ id: number }>('key');
      expect(result).toEqual({ id: 1 });
    });

    it('returns null when key does not exist', () => {
      mockStorage.getString.mockReturnValueOnce(undefined);
      const result = appStorage.get('key');
      expect(result).toBeNull();
    });

    it('returns null on parse error', () => {
      mockStorage.getString.mockReturnValueOnce('invalid json {{{');
      const result = appStorage.get('key');
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
