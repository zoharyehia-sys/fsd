import { useState, useEffect } from 'react';

const STORAGE_KEY = 'viewed_pets';

interface UseViewedPetsReturn {
  viewedPets: string[];
  addViewed: (petId: string) => void;
  clearViewed: () => void;
  isViewed: (petId: string) => boolean;
}

export const useViewedPets = (): UseViewedPetsReturn => {
  const [viewedPets, setViewedPets] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViewedPets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading viewed pets:', error);
    }
  }, []);

  // Save to localStorage when viewedPets changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedPets));
    } catch (error) {
      console.error('Error saving viewed pets:', error);
    }
  }, [viewedPets]);

  const addViewed = (petId: string) => {
    setViewedPets((prev) => {
      if (!prev.includes(petId)) {
        return [petId, ...prev].slice(0, 10); // Keep only last 10
      }
      return prev;
    });
  };

  const clearViewed = () => {
    setViewedPets([]);
  };

  const isViewed = (petId: string) => {
    return viewedPets.includes(petId);
  };

  return { viewedPets, addViewed, clearViewed, isViewed };
};
