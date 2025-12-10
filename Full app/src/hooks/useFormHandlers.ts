import { useCallback, useMemo } from 'react';

export const useFormHandlers = () => {
  // Debounced input handler to reduce re-renders during typing
  const createDebouncedHandler = useCallback((handler: (value: any) => void, delay: number = 300) => {
    let timeoutId: NodeJS.Timeout;
    
    return (value: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(value), delay);
    };
  }, []);

  // Generic input change handler
  const handleInputChange = useCallback((setter: (value: any) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };
  }, []);

  // Generic select change handler
  const handleSelectChange = useCallback((setter: (value: any) => void) => {
    return (value: string) => {
      setter(value);
    };
  }, []);

  // Generic checkbox change handler
  const handleCheckboxChange = useCallback((setter: (value: boolean) => void) => {
    return (checked: boolean) => {
      setter(checked);
    };
  }, []);

  // Date formatting utility
  const formatDateForDisplay = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate(); // Remove padStart to avoid leading zero
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }, []);

  // Array manipulation helpers
  const arrayHelpers = useMemo(() => ({
    addItem: <T,>(array: T[], newItem: T): T[] => [...array, newItem],
    removeItem: <T,>(array: T[], index: number): T[] => array.filter((_, i) => i !== index),
    updateItem: <T,>(array: T[], index: number, updates: Partial<T>): T[] => 
      array.map((item, i) => i === index ? { ...item, ...updates } : item)
  }), []);

  return {
    createDebouncedHandler,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    formatDateForDisplay,
    arrayHelpers
  };
};