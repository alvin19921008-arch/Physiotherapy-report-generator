import { useMemo, useCallback } from 'react';
import { formatDateOptimized, measurePerformance } from '@/utils/performance';

export const useOptimizedFormHandlers = () => {
  // Memoized date formatter
  const formatDateForDisplay = useCallback((dateString: string) => {
    return measurePerformance('formatDate', () => formatDateOptimized(dateString));
  }, []);

  // Optimized input handler factory with debouncing
  const createOptimizedInputHandler = useCallback((
    setter: (value: string) => void,
    debounce = true,
    delay = 300
  ) => {
    if (!debounce) {
      return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
      };
    }

    let timeoutId: NodeJS.Timeout;
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setter(value), delay);
    };
  }, []);

  // Optimized select handler
  const createOptimizedSelectHandler = useCallback((setter: (value: string) => void) => {
    return (value: string) => setter(value);
  }, []);

  // Optimized checkbox handler
  const createOptimizedCheckboxHandler = useCallback((setter: (value: boolean) => void) => {
    return (checked: boolean) => setter(checked);
  }, []);

  // Optimized date handler
  const createOptimizedDateHandler = useCallback((setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);
  }, []);

  return {
    formatDateForDisplay,
    createOptimizedInputHandler,
    createOptimizedSelectHandler,
    createOptimizedCheckboxHandler,
    createOptimizedDateHandler
  };
};