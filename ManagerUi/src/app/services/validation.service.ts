import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // Password validation
  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;

      return !passwordValid ? {
        passwordStrength: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial,
          isValidLength
        }
      } : null;
    };
  }

  // Strong password validation for internal users
  static strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[@$!%*?&]/.test(value);
      const isValidLength = value.length >= 12;
      const hasNoSpaces = !/\s/.test(value);
      const hasNoCommonPatterns = !this.hasCommonPatterns(value);

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && 
                           isValidLength && hasNoSpaces && hasNoCommonPatterns;

      return !passwordValid ? {
        strongPassword: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial,
          isValidLength,
          hasNoSpaces,
          hasNoCommonPatterns
        }
      } : null;
    };
  }

  // Check for common weak patterns
  private static hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i,
      /welcome/i,
      /(.)\1{3,}/, // Same character repeated 4+ times
      /^(.{1,3})\1+$/ // Simple repetition patterns
    ];
    
    return commonPatterns.some(pattern => pattern.test(password));
  }

  // Password strength meter
  static getPasswordStrength(password: string): { score: number; label: string; color: string } {
    if (!password) return { score: 0, label: 'No password', color: '#dc3545' };
    
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    // Bonus points
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated chars
    if (!/\s/.test(password)) score += 1; // No spaces
    if (!this.hasCommonPatterns(password)) score += 1; // No common patterns
    
    // Determine strength
    if (score <= 3) return { score, label: 'Very Weak', color: '#dc3545' };
    if (score <= 5) return { score, label: 'Weak', color: '#fd7e14' };
    if (score <= 7) return { score, label: 'Fair', color: '#ffc107' };
    if (score <= 9) return { score, label: 'Good', color: '#20c997' };
    return { score, label: 'Excellent', color: '#28a745' };
  }

  // Email validation
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return !emailRegex.test(value) ? { invalidEmail: true } : null;
    };
  }

  // Name validation (no numbers or special chars)
  static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
      return !nameRegex.test(value) ? { invalidName: true } : null;
    };
  }

  // Phone validation
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return !phoneRegex.test(value) ? { invalidPhone: true } : null;
    };
  }

  // Get error message for field
  static getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    if (errors['required']) {
      return `${fieldName} is required`;
    }
    if (errors['email'] || errors['invalidEmail']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['pattern']) {
      return `${fieldName} format is invalid`;
    }
    if (errors['invalidName']) {
      return `${fieldName} can only contain letters, spaces, hyphens and apostrophes`;
    }
    if (errors['invalidPhone']) {
      return 'Please enter a valid phone number';
    }
    if (errors['passwordStrength']) {
      return 'Password must contain at least 8 characters with uppercase, lowercase, number and special character';
    }
    return `${fieldName} is invalid`;
  }
}
