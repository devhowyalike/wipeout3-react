import { useState, useEffect } from 'react';

/**
 * Subscribes to `(prefers-reduced-motion: reduce)`. Returns `true` when the user prefers reduced motion
 * (or `false` when the query is unsupported).
 */
export function useReducedMotion(): boolean {
  // Default to false (animation enabled) if the query isn't supported
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports matchMedia and the prefers-reduced-motion query
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    if (mediaQuery) {
      setPrefersReducedMotion(mediaQuery.matches);
    }
    
    // Add listener for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    // Set up the event listener using the modern API
    if (mediaQuery) {
      // Modern API (standard)
      mediaQuery.addEventListener('change', handleChange);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);
  
  return prefersReducedMotion;
}