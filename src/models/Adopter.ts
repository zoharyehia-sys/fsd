export class Adopter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeType: string;
  experience: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    homeType: string,
    experience: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.homeType = homeType;
    this.experience = experience;
  }
}
