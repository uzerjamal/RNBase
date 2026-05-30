import { z } from 'zod';

import { api } from './api';

const mockFetch = jest.fn();
(globalThis as { fetch: typeof fetch }).fetch = mockFetch as typeof fetch;

const identity = (d: unknown): unknown => d;

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success result on 200', async () => {
    const data = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await api.get('/test', identity);
    expect(result).toEqual({ success: true, data });
  });

  it('returns error result on non-200', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({ message: 'Resource not found' }),
    });

    const result = await api.get('/test', identity);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.status).toBe(404);
    }
  });

  it('returns error result on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await api.get('/test', identity);
    expect(result.success).toBe(false);
  });

  it('logs when error response body cannot be parsed', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: () => Promise.reject(new Error('not json')),
    });

    const result = await api.get('/test', identity);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.status).toBe(502);
    }
  });

  it('sends body on POST', async () => {
    const body = { name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });

    await api.post('/test', body, identity);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }),
    );
  });

  it('calls PUT with body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await api.put('/test', { id: 1 }, identity);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('calls PATCH with body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await api.patch('/test', { id: 1 }, identity);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('calls DELETE without body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await api.delete('/test', identity);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('validates response against schema when provided', async () => {
    const schema = z.object({ id: z.number(), name: z.string() });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'Test' }),
    });

    const result = await api.get('/test', identity, { schema });
    expect(result.success).toBe(true);
  });

  it('returns validation error when response does not match schema', async () => {
    const schema = z.object({ id: z.number(), name: z.string() });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ wrong: 'shape' }),
    });

    const result = await api.get('/test', identity, { schema });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
  });
});
