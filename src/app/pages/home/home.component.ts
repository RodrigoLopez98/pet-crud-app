// src/app/pages/home/home.component.ts
import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';
import { NotificationService } from '../../services/notification.service';
import { Pet, PetFormData } from '../../models/pet.model';
import { PetFormComponent } from '../../components/pet-form/pet-form.component';
import { PetListComponent } from '../../components/pet-list/pet-list.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PetFormComponent,
    PetListComponent,
    ConfirmDialogComponent,
    NotificationComponent,
    LucideAngularModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isFormOpen = signal(false);
  isDeleteDialogOpen = signal(false);
  selectedPet = signal<Pet | null>(null);
  newPetAdded = signal<string | null>(null);

  protected readonly Plus = Plus;

  constructor(
    public petService: PetService,
    private notificationService: NotificationService
  ) {
    effect(() => {
      const newPetId = this.newPetAdded();
      if (newPetId) {
        setTimeout(() => {
          this.newPetAdded.set(null);
        }, 2000);
      }
    });
  }

  openForm(pet?: Pet): void {
    this.selectedPet.set(pet || null);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.selectedPet.set(null);
  }

  onPetSaved(petData: PetFormData): void {
    if (this.selectedPet()) {
      const updated = this.petService.updatePet(this.selectedPet()!.id, petData);
      if (updated) {
        this.notificationService.success('Mascota actualizada exitosamente');
      }
    } else {
      const newPet = this.petService.addPet(petData);
      this.newPetAdded.set(newPet.id);
      this.notificationService.success('Mascota agregada exitosamente');
    }
    this.closeForm();
  }

  onEditPet(pet: Pet): void {
    this.openForm(pet);
  }

  onDeletePet(pet: Pet): void {
    this.selectedPet.set(pet);
    this.isDeleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    if (this.selectedPet()) {
      const petName = this.selectedPet()!.nombre;
      const deleted = this.petService.deletePet(this.selectedPet()!.id);
      if (deleted) {
        this.notificationService.success(`${petName} eliminado exitosamente`);
      }
      this.isDeleteDialogOpen.set(false);
      this.selectedPet.set(null);
    }
  }

  cancelDelete(): void {
    this.isDeleteDialogOpen.set(false);
    this.selectedPet.set(null);
  }
}

