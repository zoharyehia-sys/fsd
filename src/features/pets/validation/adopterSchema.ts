export interface AdopterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeType: string;
  experience: string;
  additionalInfo?: string;
}

export interface ValidationError {
  [key: string]: string;
}

export class AdopterSchema {
  static validate(data: Partial<AdopterFormData>): { valid: boolean; errors: ValidationError } {
    const errors: ValidationError = {};

    // First Name validation
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required';
    } else if (data.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (data.firstName.trim().length > 50) {
      errors.firstName = 'First name cannot exceed 50 characters';
    }

    // Last Name validation
    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    } else if (data.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (data.lastName.trim().length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }

    // Email validation
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation
    if (!data.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!this.isValidPhone(data.phone)) {
      errors.phone = 'Invalid phone format';
    }

    // Home Type validation
    if (!data.homeType?.trim()) {
      errors.homeType = 'Home type is required';
    } else if (!['apartment', 'house', 'farm', 'other'].includes(data.homeType.toLowerCase())) {
      errors.homeType = 'Invalid home type';
    }

    // Experience validation
    if (!data.experience?.trim()) {
      errors.experience = 'Experience level is required';
    } else if (!['none', 'some', 'extensive'].includes(data.experience.toLowerCase())) {
      errors.experience = 'Invalid experience level';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    // Accept phone numbers with various formats
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  }
}
