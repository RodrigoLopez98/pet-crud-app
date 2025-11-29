// src/app/components/pet-form/pet-form.component.ts
import { Component, input, output, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pet, PetFormData } from '../../models/pet.model';
import { LucideAngularModule, X, Save, Loader } from 'lucide-angular';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent {
  isOpen = input.required<boolean>();
  pet = input<Pet | null>(null);

  saved = output<PetFormData>();
  cancelled = output<void>();

  protected readonly X = X;
  protected readonly Save = Save;
  protected readonly Loader = Loader;

  petForm: FormGroup;
  isSubmitting = signal(false);
  isEditMode = computed(() => !!this.pet());

  constructor(private fb: FormBuilder) {
    this.petForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      raza: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      edad: [null, [Validators.required, Validators.min(0), Validators.max(30)]]
    });

    effect(() => {
      if (this.isOpen() && this.pet()) {
        this.petForm.patchValue({
          nombre: this.pet()!.nombre,
          raza: this.pet()!.raza,
          edad: this.pet()!.edad
        });
      } else if (this.isOpen() && !this.pet()) {
        this.petForm.reset();
      }
    });
  }

  get nombre() {
    return this.petForm.get('nombre');
  }

  get raza() {
    return this.petForm.get('raza');
  }

  get edad() {
    return this.petForm.get('edad');
  }

  onSubmit(): void {
    if (this.petForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      setTimeout(() => {
        this.saved.emit(this.petForm.value as PetFormData);
        this.petForm.reset();
        this.isSubmitting.set(false);
      }, 300);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.petForm.reset();
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('pet-form__backdrop')) {
      this.onCancel();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.petForm.controls).forEach(key => {
      const control = this.petForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.petForm.get(controlName);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} es requerido`;
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldLabel(controlName)} debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return `${this.getFieldLabel(controlName)} no puede tener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return `La edad debe ser mayor o igual a ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `La edad no puede ser mayor a ${control.errors?.['max'].max}`;
    }

    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      nombre: 'El nombre',
      raza: 'La raza',
      edad: 'La edad'
    };
    return labels[controlName] || controlName;
  }
}

