// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

/** Modelo de dominio de un hotel (espejo del contrato de la API REST). */
export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  description?: string | null;
  createdAt: string;
}

/** Datos de entrada para crear o editar un hotel. */
export interface HotelInput {
  name: string;
  address: string;
  city: string;
  rating: number;
  description?: string | null;
}

/** Criterio de búsqueda por nombre y/o calificación mínima. */
export interface HotelFilter {
  name?: string;
  minRating?: number;
}
