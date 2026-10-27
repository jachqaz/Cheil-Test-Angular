// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../data/hotel.service';
import { Hotel } from '../../domain/hotel.model';
import { StarRatingComponent } from '../shared/star-rating.component';
import { HotelDetailModalComponent } from '../shared/hotel-detail-modal.component';

/**
 * Landing de usuario (MVVM): introducción a la cadena, listado de hoteles y
 * búsqueda por nombre y/o calificación. El estado vive en signals (ViewModel).
 */
@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, StarRatingComponent, HotelDetailModalComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  private readonly hotelService = inject(HotelService);

  protected readonly hotels = signal<Hotel[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedId = signal<string | null>(null);

  protected name = '';
  protected minRating = 0;

  protected imageUrl(id: string): string {
    return this.hotelService.imageUrl(id);
  }

  protected openDetail(id: string): void {
    this.selectedId.set(id);
  }

  protected closeDetail(): void {
    this.selectedId.set(null);
  }

  constructor() {
    this.search();
  }

  protected search(): void {
    this.loading.set(true);
    this.error.set(null);
    this.hotelService
      .list({ name: this.name, minRating: this.minRating || undefined })
      .subscribe({
        next: (hotels) => {
          this.hotels.set(hotels);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los hoteles. ¿Está arriba la API?');
          this.loading.set(false);
        },
      });
  }

  protected clear(): void {
    this.name = '';
    this.minRating = 0;
    this.search();
  }
}
