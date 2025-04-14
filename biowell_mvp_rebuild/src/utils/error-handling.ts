import { logException } from './analytics';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context?: string): AppError {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(
      error.message,
      'UNKNOWN_ERROR',
      { originalError: error.name }
    );
  } else {
    appError = new AppError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error in ${context || 'unknown context'}:`, {
      message: appError.message,
      code: appError.code,
      metadata: appError.metadata
    });
  }

  // Track in analytics
  logException(
    `${appError.code || 'ERROR'}: ${appError.message}`,
    false
  );

  return appError;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}