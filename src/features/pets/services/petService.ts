import { Pet } from '../../../models';

export class PetService {
  private static petsCache: Pet[] | null = null;

  static async fetchAll(): Promise<Pet[]> {
    if (this.petsCache) {
      return this.petsCache;
    }

    try {
      const response = await fetch('/data/pets.json');
      const data = await response.json();
      this.petsCache = data.map(
        (pet: any) =>
          new Pet(
            pet.id,
            pet.firstName,
            pet.birthYear,
            pet.animalType,
            pet.gender,
            pet.description,
            pet.pictureUrl
          )
      );
      return this.petsCache || [];
    } catch (error) {
      console.error('Error fetching pets:', error);
      return [];
    }
  }

  static filter(
    pets: Pet[],
    search: string = '',
    animalType: string = '',
    gender: string = ''
  ): Pet[] {
    return pets.filter((pet) => {
      const matchSearch = pet.firstName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = !animalType || pet.animalType === animalType;
      const matchGender = !gender || pet.gender === (gender as 'male' | 'female');

      return matchSearch && matchType && matchGender;
    });
  }

  static getById(pets: Pet[], id: string): Pet | undefined {
    return pets.find((pet) => pet.id === id);
  }

  static paginate(
    items: Pet[],
    page: number = 1,
    pageSize: number = 12
  ): { items: Pet[]; total: number; pages: number } {
    const total = items.length;
    const pages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      items: items.slice(start, end),
      total,
      pages,
    };
  }

  static getUniqueAnimalTypes(pets: Pet[]): string[] {
    return Array.from(new Set(pets.map((pet) => pet.animalType))).sort();
  }

  static getUniqueGenders(pets: Pet[]): string[] {
    return Array.from(new Set(pets.map((pet) => pet.gender))).sort();
  }
}
