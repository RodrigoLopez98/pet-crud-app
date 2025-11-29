// src/app/components/pet-list/pet-list.component.ts
import { Component, input, output, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pet } from '../../models/pet.model';
import { PetCardComponent } from '../pet-card/pet-card.component';
import { LucideAngularModule, Search, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Plus, Heart } from 'lucide-angular';

type SortField = 'nombre' | 'edad' | 'raza' | null;
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PetCardComponent, LucideAngularModule],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss'
})
export class PetListComponent {
  pets = input.required<Pet[]>();
  isLoading = input<boolean>(false);
  onEdit = output<Pet>();
  onDelete = output<Pet>();

  protected readonly Search = Search;
  protected readonly Filter = SlidersHorizontal;
  protected readonly ArrowUpDown = ArrowUpDown;
  protected readonly ArrowUp = ArrowUp;
  protected readonly ArrowDown = ArrowDown;
  protected readonly Plus = Plus;
  protected readonly Heart = Heart;

  searchQuery = signal<string>('');
  selectedBreed = signal<string>('all');
  sortField = signal<SortField>(null);
  sortDirection = signal<SortDirection>(null);
  isMobile = signal<boolean>(false);

  uniqueBreeds = computed(() => {
    const breeds = new Set(this.pets().map(pet => pet.raza));
    return Array.from(breeds).sort();
  });

  filteredAndSortedPets = computed(() => {
    let result = [...this.pets()];

    if (this.searchQuery().trim()) {
      const query = this.searchQuery().toLowerCase().trim();
      result = result.filter(pet =>
        pet.nombre.toLowerCase().includes(query) ||
        pet.raza.toLowerCase().includes(query) ||
        pet.edad.toString().includes(query)
      );
    }

    if (this.selectedBreed() !== 'all') {
      result = result.filter(pet => pet.raza === this.selectedBreed());
    }

    if (this.sortField() && this.sortDirection()) {
      result.sort((a, b) => {
        const field = this.sortField()!;
        let comparison = 0;

        if (field === 'nombre' || field === 'raza') {
          comparison = a[field].localeCompare(b[field]);
        } else if (field === 'edad') {
          comparison = a.edad - b.edad;
        }

        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.updateIsMobile(window.innerWidth);
      window.addEventListener('resize', () => this.updateIsMobile(window.innerWidth));
    }
  }

  private updateIsMobile(width: number): void {
    this.isMobile.set(width < 768);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.searchQuery.set(target.value);
    }
  }

  onBreedFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.selectedBreed.set(target.value);
    }
  }

  onSort(field: SortField): void {
    if (this.sortField() === field) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else if (this.sortDirection() === 'desc') {
        this.sortField.set(null);
        this.sortDirection.set(null);
      } else {
        this.sortDirection.set('asc');
      }
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  getSortIcon(field: SortField): typeof ArrowUpDown | typeof ArrowUp | typeof ArrowDown {
    if (this.sortField() !== field) {
      return ArrowUpDown;
    }
    return this.sortDirection() === 'asc' ? ArrowUp : ArrowDown;
  }

  handleEdit(pet: Pet): void {
    this.onEdit.emit(pet);
  }

  handleDelete(pet: Pet): void {
    this.onDelete.emit(pet);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedBreed.set('all');
    this.sortField.set(null);
    this.sortDirection.set(null);
  }
}

