import { z } from 'zod';

import { parseData, assertData } from './validation';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

describe('parseData', () => {
  it('returns success for valid data', () => {
    const data = { id: 1, name: 'Alice', email: 'alice@example.com' };
    const result = parseData(UserSchema, data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  it('returns failure for missing field', () => {
    const result = parseData(UserSchema, { id: 1, name: 'Alice' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.field).toBe('email');
    }
  });

  it('returns failure for wrong type', () => {
    const result = parseData(UserSchema, { id: 'not-a-number', name: 'Alice', email: 'a@b.com' });
    expect(result.success).toBe(false);
  });

  it('returns failure for non-object input', () => {
    const result = parseData(UserSchema, null);
    expect(result.success).toBe(false);
  });

  it('returns failure for completely wrong shape', () => {
    const result = parseData(UserSchema, 'a string');
    expect(result.success).toBe(false);
  });
});

describe('assertData', () => {
  it('returns data for valid input', () => {
    const data = { id: 1, name: 'Alice', email: 'alice@example.com' };
    expect(assertData(UserSchema, data)).toEqual(data);
  });

  it('throws for invalid input', () => {
    expect(() => assertData(UserSchema, { id: 1 })).toThrow();
  });
});
