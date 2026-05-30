import * as Sentry from '@sentry/react-native';

import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds breadcrumb on info', () => {
    logger.info('test message');
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'info', message: 'test message' }),
    );
  });

  it('captures exception on error with Error instance', () => {
    const error = new Error('test error');
    logger.error('something failed', error);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('does not capture exception for non-Error values', () => {
    logger.error('something failed', 'string error');
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
