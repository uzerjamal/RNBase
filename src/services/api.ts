import Config from 'react-native-config';
import { type ZodSchema } from 'zod';

import { logger } from '@/utils/logger';
import { parseData } from '@/utils/validation';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiError };

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  schema?: ZodSchema<unknown>;
}

const BASE_URL = Config.API_BASE_URL ?? '';
const DEFAULT_TIMEOUT = 10_000;

async function request<T>(
  method: string,
  path: string,
  validate: (data: unknown) => T,
  body?: unknown,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? DEFAULT_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = (await response.json().catch((err: unknown) => {
        logger.error(`Failed to parse error response from ${method} ${path}`, err);
        return {};
      })) as { message?: string; code?: string };
      const error: ApiError = {
        message: errorBody.message ?? response.statusText,
        status: response.status,
      };
      if (errorBody.code !== undefined) {
        error.code = errorBody.code;
      }
      logger.warn(`API ${method} ${path} failed`, error);
      return { success: false, error };
    }

    const raw: unknown = await response.json();

    if (options.schema) {
      const parsed = parseData(options.schema, raw, `${method} ${path}`);
      if (!parsed.success) {
        const error: ApiError = {
          message: parsed.error.message,
          status: response.status,
          code: 'VALIDATION_ERROR',
        };
        return { success: false, error };
      }
      return { success: true, data: parsed.data as T };
    }

    const data = validate(raw);
    return { success: true, data };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === 'AbortError') {
      const error: ApiError = { message: 'Request timed out', status: 0 };
      logger.error(`API ${method} ${path} timed out`);
      return { success: false, error };
    }

    const error: ApiError = {
      message: err instanceof Error ? err.message : 'Unknown error',
      status: 0,
    };
    logger.error(`API ${method} ${path} threw`, err);
    return { success: false, error };
  }
}

export const api = {
  get: <T>(
    path: string,
    validate: (data: unknown) => T,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> => request<T>('GET', path, validate, undefined, options),

  post: <T>(
    path: string,
    body: unknown,
    validate: (data: unknown) => T,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> => request<T>('POST', path, validate, body, options),

  put: <T>(
    path: string,
    body: unknown,
    validate: (data: unknown) => T,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> => request<T>('PUT', path, validate, body, options),

  patch: <T>(
    path: string,
    body: unknown,
    validate: (data: unknown) => T,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> => request<T>('PATCH', path, validate, body, options),

  delete: <T>(
    path: string,
    validate: (data: unknown) => T,
    options?: RequestOptions,
  ): Promise<ApiResult<T>> => request<T>('DELETE', path, validate, undefined, options),
};
