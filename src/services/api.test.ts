import { api } from './api';

const mockFetch = jest.fn();
(globalThis as { fetch: typeof fetch }).fetch = mockFetch as typeof fetch;

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

    const result = await api.get('/test');
    expect(result).toEqual({ success: true, data });
  });

  it('returns error result on non-200', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({ message: 'Resource not found' }),
    });

    const result = await api.get('/test');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.status).toBe(404);
    }
  });

  it('returns error result on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await api.get('/test');
    expect(result.success).toBe(false);
  });

  it('sends body on POST', async () => {
    const body = { name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });

    await api.post('/test', body);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }),
    );
  });

  it('calls PUT with body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await api.put('/test', { id: 1 });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('calls PATCH with body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await api.patch('/test', { id: 1 });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('calls DELETE without body', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    await api.delete('/test');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
