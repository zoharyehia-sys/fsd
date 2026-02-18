import type { Pet } from "../../../models/Pet";
import petsJson from "../../../data/pets.json?raw";

export class PetService {
  private static petsCache: Pet[] | null = null;
  private static parsedPets: Array<Record<string, unknown>> | null = null;

  private static getSourcePets(): Array<Record<string, unknown>> {
    if (this.parsedPets) return this.parsedPets;
    this.parsedPets = JSON.parse(petsJson) as Array<Record<string, unknown>>;
    return this.parsedPets;
  }

  static async fetchAll(): Promise<Pet[]> {
    if (this.petsCache) {
      return this.petsCache;
    }

    try {
      const data = this.getSourcePets();
      this.petsCache = data.map(
        (pet): Pet => ({
          id: String(pet.id),
          firstName: String(pet.firstName),
          birthYear: Number(pet.birthYear),
          animalType: String(pet.animalType),
          gender: String(pet.gender),
          description: String(pet.description),
          pictureUrl: String(pet.pictureUrl),
        }),
      );
      return this.petsCache || [];
    } catch (error) {
      console.error("Error fetching pets:", error);
      return [];
    }
  }

  static filter(
    pets: Pet[],
    search: string = "",
    animalType: string = "",
    gender: string = "",
  ): Pet[] {
    return pets.filter((pet) => {
      const matchSearch = pet.firstName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = !animalType || pet.animalType === animalType;
      const matchGender =
        !gender || pet.gender === (gender as "male" | "female");

      return matchSearch && matchType && matchGender;
    });
  }

  static getById(pets: Pet[], id: string): Pet | undefined {
    return pets.find((pet) => pet.id === id);
  }

  static paginate(
    items: Pet[],
    page: number = 1,
    pageSize: number = 12,
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
