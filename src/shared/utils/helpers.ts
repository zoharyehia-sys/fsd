import { useState, useCallback } from "react";

export const ageCalc = (year: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - year;
};

export const formatDate = (date: Date) => date.toLocaleDateString("he-IL");
export const capitalize = (text: string) => text;

export function useExpandedPanel(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const collapse = useCallback(() => setIsExpanded(false), []);
  const expand = useCallback(() => setIsExpanded(true), []);

  return {
    isExpanded,
    isCollapsed: !isExpanded,
    toggleExpand,
    collapse,
    expand,
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
