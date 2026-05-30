import * as Sentry from '@sentry/react-native';
import type { SeverityLevel } from '@sentry/react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENTRY_LEVEL_MAP: Record<LogLevel, SeverityLevel> = {
  debug: 'debug',
  info: 'info',
  warn: 'warning',
  error: 'error',
};

const isDev = __DEV__;

/* eslint-disable no-console */
function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (isDev) {
    if (level === 'error') {
      console.error(`[${level.toUpperCase()}] ${message}`, ...args);
    } else if (level === 'warn') {
      console.warn(`[${level.toUpperCase()}] ${message}`, ...args);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`, ...args);
    }
  }

  const breadcrumb: Sentry.Breadcrumb = {
    category: 'log',
    message,
    level: SENTRY_LEVEL_MAP[level],
  };
  if (args.length > 0) {
    breadcrumb.data = { args };
  }
  Sentry.addBreadcrumb(breadcrumb);
}
/* eslint-enable no-console */

export const logger = {
  debug: (message: string, ...args: unknown[]): void => log('debug', message, ...args),
  info: (message: string, ...args: unknown[]): void => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]): void => log('warn', message, ...args),
  error: (message: string, error?: unknown): void => {
    log('error', message, error);
    if (error instanceof Error) {
      Sentry.captureException(error);
    }
  },
};
