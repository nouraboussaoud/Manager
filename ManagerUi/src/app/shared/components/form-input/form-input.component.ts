import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  template: `
    <div class="form-group">
      <label [for]="inputId" class="form-label" [class.required]="required">
        {{ label }}
        <span *ngIf="required" class="required-asterisk">*</span>
      </label>
      
      <div class="input-container">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [class]="inputClasses"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          clrInput />
        
        <clr-icon 
          *ngIf="showValidationIcon" 
          [shape]="isValid ? 'check-circle' : 'exclamation-triangle'"
          [class]="isValid ? 'success-icon' : 'error-icon'">
        </clr-icon>
      </div>
      
      <!-- Password Strength Indicator -->
      <div *ngIf="type === 'password' && value && control?.errors?.['passwordStrength']" 
           class="password-strength">
        <div class="strength-requirements">
          <div [class.met]="control.errors['passwordStrength'].isValidLength">
            <clr-icon [shape]="control.errors['passwordStrength'].isValidLength ? 'check' : 'times'"></clr-icon>
            At least 8 characters
          </div>
          <div [class.met]="control.errors['passwordStrength'].hasUpper">
            <clr-icon [shape]="control.errors['passwordStrength'].hasUpper ? 'check' : 'times'"></clr-icon>
            One uppercase letter
          </div>
          <div [class.met]="control.errors['passwordStrength'].hasLower">
            <clr-icon [shape]="control.errors['passwordStrength'].hasLower ? 'check' : 'times'"></clr-icon>
            One lowercase letter
          </div>
          <div [class.met]="control.errors['passwordStrength'].hasNumber">
            <clr-icon [shape]="control.errors['passwordStrength'].hasNumber ? 'check' : 'times'"></clr-icon>
            One number
          </div>
          <div [class.met]="control.errors['passwordStrength'].hasSpecial">
            <clr-icon [shape]="control.errors['passwordStrength'].hasSpecial ? 'check' : 'times'"></clr-icon>
            One special character
          </div>
        </div>
      </div>
      
      <!-- Error Messages -->
      <div *ngIf="showError" class="error-message">
        <clr-icon shape="exclamation-triangle"></clr-icon>
        {{ errorMessage }}
      </div>
      
      <!-- Helper Text -->
      <div *ngIf="helperText && !showError" class="helper-text">
        {{ helperText }}
      </div>
    </div>
  `,
  styleUrls: ['./form-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() helperText: string = '';
  @Input() control: AbstractControl | null = null;

  value: string = '';
  inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  isTouched: boolean = false;
  isFocused: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  passwordStrength: { score: number; label: string; color: string } = { score: 0, label: '', color: '' };

  ngOnInit() {
    if (this.type === 'password' && this.control) {
      this.control.valueChanges.subscribe(value => {
        this.passwordStrength = ValidationService.getPasswordStrength(value || '');
      });
    }
  }

  get isValid(): boolean {
    return this.control ? this.control.valid && this.isTouched : false;
  }

  get showError(): boolean {
    return this.control ? this.control.invalid && this.isTouched : false;
  }

  get showValidationIcon(): boolean {
    return this.isTouched && this.value.length > 0;
  }

  get errorMessage(): string {
    if (this.control?.errors) {
      return ValidationService.getErrorMessage(this.label, this.control.errors);
    }
    return '';
  }

  get inputClasses(): string {
    let classes = 'form-input';
    if (this.showError) classes += ' error';
    if (this.isValid) classes += ' valid';
    if (this.isFocused) classes += ' focused';
    return classes;
  }

  onInput(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.isTouched = true;
    this.isFocused = false;
    this.onTouched();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get isStrongPasswordField(): boolean {
    return this.type === 'password' && 
           this.control?.hasError('strongPassword');
  }

  get strongPasswordErrors(): any {
    return this.control?.errors?.['strongPassword'] || {};
  }
}
