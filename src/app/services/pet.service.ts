// src/app/services/pet.service.ts
import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Pet, PetFormData } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly STORAGE_KEY = 'pets-crud-app';
  private readonly isBrowser: boolean;
  
  private _pets = signal<Pet[]>([]);

  readonly pets = this._pets.asReadonly();

  readonly petsCount = computed(() => this._pets().length);
  readonly breeds = computed(() => {
    const breeds = new Set(this._pets().map(pet => pet.raza));
    return Array.from(breeds).sort();
  });

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this._pets.set(this.loadFromStorage());
      
      effect(() => {
        const pets = this._pets();
        this.saveToStorage(pets);
      });
    }
  }

  private loadFromStorage(): Pet[] {
    if (!this.isBrowser) {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading pets from storage:', error);
    }
    return [];
  }

  private saveToStorage(pets: Pet[]): void {
    if (!this.isBrowser) {
      return;
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pets));
    } catch (error) {
      console.error('Error saving pets to storage:', error);
    }
  }

  addPet(petData: PetFormData): Pet {
    const newPet: Pet = {
      ...petData,
      id: this.generateId(),
      createdAt: Date.now()
    };
    
    this._pets.update(pets => [...pets, newPet]);
    return newPet;
  }

  updatePet(id: string, petData: PetFormData): Pet | null {
    const updatedPet: Pet = {
      ...petData,
      id,
      createdAt: this._pets().find(p => p.id === id)?.createdAt || Date.now()
    };

    this._pets.update(pets => 
      pets.map(pet => pet.id === id ? updatedPet : pet)
    );

    return updatedPet;
  }

  deletePet(id: string): boolean {
    const exists = this._pets().some(p => p.id === id);
    if (exists) {
      this._pets.update(pets => pets.filter(pet => pet.id !== id));
      return true;
    }
    return false;
  }

  getPetById(id: string): Pet | undefined {
    return this._pets().find(pet => pet.id === id);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

