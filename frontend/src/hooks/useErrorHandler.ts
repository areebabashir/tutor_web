import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  title?: string;
  description?: string;
  duration?: number;
  showRefreshAction?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | string | unknown, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      title = 'Something went wrong',
      description,
      duration = 5000,
      showRefreshAction = true
    } = options;

    let errorMessage = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    console.error('Error handled by useErrorHandler:', error);

    const toastOptions: any = {
      description: description || errorMessage,
      duration,
      style: {
        background: '#3b82f6',
        color: 'white',
        border: '1px solid #2563eb'
      }
    };

    if (showRefreshAction) {
      toastOptions.action = {
        label: 'Refresh',
        onClick: () => window.location.reload()
      };
    }

    toast.error(title, toastOptions);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}; 