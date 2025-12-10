import { MONTHS, PRONOUN_CONFIG } from '@/constants';

// Memoized date formatting utility
const dateFormatCache = new Map<string, string>();

export const formatDateOptimized = (dateString: string): string => {
  if (!dateString) return '';
  
  // Check cache first
  if (dateFormatCache.has(dateString)) {
    return dateFormatCache.get(dateString)!;
  }
  
  try {
    const date = new Date(dateString);
    const day = date.getDate(); // Remove padStart to avoid leading zero
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const formatted = `${day} ${month} ${year}`;
    
    // Cache the result
    dateFormatCache.set(dateString, formatted);
    return formatted;
  } catch (error) {
    return '';
  }
};

// Memoized pronoun utility
const pronounCache = new Map<string, typeof PRONOUN_CONFIG.Male>();

export const getPronounsOptimized = (sex: string) => {
  if (pronounCache.has(sex)) {
    return pronounCache.get(sex)!;
  }
  
  const pronouns = sex === 'Male' ? PRONOUN_CONFIG.Male :
                   sex === 'Female' ? PRONOUN_CONFIG.Female :
                   PRONOUN_CONFIG.default;
  
  pronounCache.set(sex, pronouns);
  return pronouns;
};

// Optimized region text generation
export const getRegionTextOptimized = (side: string, location: string): string => {
  if (location === 'back' || location === 'neck') {
    return location;
  }
  
  if (side && location) {
    return side === 'bilateral' ? `bilateral ${location}` : `${side} ${location}`;
  }
  
  return location || 'affected area';
};

// Debounced input handler factory
export const createDebouncedHandler = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number = 300
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
};

// Memory cleanup utility
export const clearCaches = () => {
  dateFormatCache.clear();
  pronounCache.clear();
};

// Performance measurement utility
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  if (process.env.NODE_ENV !== 'development') {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (end - start > 16) { // Warn if slower than 60fps
    console.warn(`🐌 Slow operation "${name}": ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};

// Batch DOM updates utility
export const batchDOMUpdates = (updates: (() => void)[]): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};