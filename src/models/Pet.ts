export class Pet {
  id: string;
  firstName: string;
  birthYear: number;
  animalType: string;
  gender: string;
  description: string;
  pictureUrl: string;

  constructor(
    id: string,
    firstName: string,
    birthYear: number,
    animalType: string,
    gender: 'male' | 'female',
    description: string,
    pictureUrl: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.birthYear = birthYear;
    this.animalType = animalType;
    this.gender = gender;
    this.description = description;
    this.pictureUrl = pictureUrl;
  }

  getAge(): number {
    return new Date().getFullYear() - this.birthYear;
  }

  getAgeDisplay(): string {
    const age = this.getAge();
    return age === 1 ? '1 year' : `${age} years`;
  }

  isYoung(): boolean {
    return this.getAge() <= 2;
  }
}
