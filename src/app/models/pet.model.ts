// src/app/models/pet.model.ts
export interface Pet {
    id: string;
    nombre: string;
    raza: string;
    edad: number;
    createdAt: number;
}

export type PetFormData = Omit<Pet, 'id' | 'createdAt'>;

