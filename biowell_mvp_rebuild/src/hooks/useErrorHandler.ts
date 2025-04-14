import { useState, useCallback } from 'react';
import { handleError, AppError } from '../utils/error-handling';

interface ErrorState {
  message: string;
  code?: string;
  show: boolean;
}

export function useErrorHandler(context?: string) {
  const [error, setError] = useState<ErrorState>({
    message: '',
    code: undefined,
    show: false
  });

  const handleAppError = useCallback((err: unknown) => {
    const appError = handleError(err, context);
    
    setError({
      message: appError.message,
      code: appError.code,
      show: true
    });

    // Auto-hide non-critical errors after 5 seconds
    if (appError.code !== 'CRITICAL_ERROR') {
      setTimeout(() => {
        setError(prev => ({ ...prev, show: false }));
      }, 5000);
    }

    return appError;
  }, [context]);

  const clearError = useCallback(() => {
    setError(prev => ({ ...prev, show: false }));
  }, []);

  return {
    error,
    handleError: handleAppError,
    clearError
  };
}