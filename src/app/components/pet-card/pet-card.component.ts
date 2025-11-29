// src/app/components/pet-card/pet-card.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../models/pet.model';
import { LucideAngularModule, Edit, Trash2, Heart } from 'lucide-angular';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.scss'
})
export class PetCardComponent {
  pet = input.required<Pet>();
  onEdit = output<Pet>();
  onDelete = output<Pet>();

  protected readonly Edit = Edit;
  protected readonly Trash2 = Trash2;
  protected readonly Heart = Heart;

  handleEdit(): void {
    this.onEdit.emit(this.pet());
  }

  handleDelete(): void {
    this.onDelete.emit(this.pet());
  }
}

