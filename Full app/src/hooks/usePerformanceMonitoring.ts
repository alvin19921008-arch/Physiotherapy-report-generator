import { useRef, useEffect } from 'react';

// Performance monitoring hook for development
export const useRenderTracker = (componentName: string, props?: any) => {
  const renderCount = useRef(0);
  const prevProps = useRef(props);

  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
      
      if (props && prevProps.current) {
        const changedProps = Object.keys(props).filter(
          key => props[key] !== prevProps.current[key]
        );
        
        if (changedProps.length > 0) {
          console.log(`📝 ${componentName} props changed:`, changedProps);
        }
      }
      
      prevProps.current = props;
    }
  });

  return renderCount.current;
};

// Memory usage tracker
export const useMemoryTracker = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`💾 ${componentName} memory:`, {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB'
      });
    }
  });
};

// Performance timing hook
export const usePerformanceTimer = (componentName: string) => {
  const startTime = useRef<number>();

  useEffect(() => {
    startTime.current = performance.now();
    
    return () => {
      if (startTime.current && process.env.NODE_ENV === 'development') {
        const duration = performance.now() - startTime.current;
        if (duration > 16) { // Only log if render takes longer than 16ms (60fps threshold)
          console.warn(`⚠️ ${componentName} slow render: ${duration.toFixed(2)}ms`);
        }
      }
    };
  });
};