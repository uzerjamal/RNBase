import { ZodError, type ZodSchema } from 'zod';

import { logger } from './logger';

export interface ValidationError {
  message: string;
  field?: string;
  code: 'VALIDATION_ERROR';
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: ValidationError };

export function parseData<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: string,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const firstError = result.error.issues[0];
  const rawField = firstError?.path.join('.');
  const message = firstError?.message ?? 'Validation failed';

  logger.warn(`Validation failed${context ? ` in ${context}` : ''}`, {
    errors: result.error.issues,
  });

  // exactOptionalPropertyTypes: build error object conditionally to avoid `field: undefined`
  const error: ValidationError =
    rawField !== undefined && rawField !== ''
      ? { message, field: rawField, code: 'VALIDATION_ERROR' }
      : { message, code: 'VALIDATION_ERROR' };

  return { success: false, error };
}

export function assertData<T>(schema: ZodSchema<T>, data: unknown, context?: string): T {
  const result = parseData(schema, data, context);
  if (!result.success) {
    throw new ZodError([
      {
        code: 'custom',
        message: result.error.message,
        path: result.error.field !== undefined ? [result.error.field] : [],
      },
    ]);
  }
  return result.data;
}
