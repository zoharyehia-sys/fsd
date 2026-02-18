import { useState, useEffect } from "react";

const STORAGE_KEY = "viewed_pets";

interface UseViewedPetsReturn {
  viewedPets: string[];
  addViewed: (petId: string) => void;
  clearViewed: () => void;
  isViewed: (petId: string) => boolean;
}

export const useViewedPets = (): UseViewedPetsReturn => {
  const [viewedPets, setViewedPets] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((id): id is string => typeof id === "string")
        .filter((id, index, arr) => arr.indexOf(id) === index)
        .slice(0, 3);
    } catch (error) {
      console.error("Error loading viewed pets:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedPets));
    } catch (error) {
      console.error("Error saving viewed pets:", error);
    }
  }, [viewedPets]);

  const addViewed = (petId: string) => {
    setViewedPets((prev) => [petId, ...prev.filter((id) => id !== petId)].slice(0, 3));
  };

  const clearViewed = () => {
    setViewedPets([]);
  };

  const isViewed = (petId: string) => {
    return viewedPets.includes(petId);
  };

  return { viewedPets, addViewed, clearViewed, isViewed };
};
