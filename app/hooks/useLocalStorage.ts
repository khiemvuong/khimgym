'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * SSR-safe localStorage hook for Next.js
 * Prevents hydration errors by only reading localStorage after mount.
 * Pattern from NotebookLM: "React Architecture Concepts and State Management Guide"
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to track if we're on the client
  const [isMounted, setIsMounted] = useState(false);

  // Always initialize with initialValue to match server render
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // After mount, read from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`useLocalStorage: error writing key "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`useLocalStorage: error removing key "${key}"`, error);
    }
  }, [key, initialValue]);

  return [isMounted ? storedValue : initialValue, setValue, removeValue] as const;
}
