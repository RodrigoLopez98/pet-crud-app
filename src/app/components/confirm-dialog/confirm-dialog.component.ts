// src/app/components/confirm-dialog/confirm-dialog.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, TriangleAlert } from 'lucide-angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Confirmar acción');
  message = input<string>('¿Estás seguro de que deseas continuar?');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  type = input<'danger' | 'warning' | 'info'>('warning');

  confirmed = output<void>();
  cancelled = output<void>();

  protected readonly X = X;
  protected readonly TriangleAlert = TriangleAlert;

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('confirm-dialog__backdrop')) {
      this.onCancel();
    }
  }
}

