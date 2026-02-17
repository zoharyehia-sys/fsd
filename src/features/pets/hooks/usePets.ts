import { useState, useEffect } from 'react';
import { Pet } from '../../../models';
import { PetService } from '../services/petService';

interface UsePetsReturn {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  animalTypes: string[];
}

export const usePets = (): UsePetsReturn => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        const data = await PetService.fetchAll();
        setPets(data);
        const types = PetService.getUniqueAnimalTypes(data);
        setAnimalTypes(types);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pets');
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  return { pets, loading, error, animalTypes };
};
