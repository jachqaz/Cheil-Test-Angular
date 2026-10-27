// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { HotelService } from '../../data/hotel.service';
import { Hotel } from '../../domain/hotel.model';
import { StarRatingComponent } from './star-rating.component';
import { DatePipe } from '@angular/common';

/**
 * Modal de detalle de un hotel (MVVM): carga el hotel por id desde la API y muestra
 * su imagen y todos sus campos. Presentacional y reutilizable; el estado vive en signals.
 */
@Component({
  selector: 'app-hotel-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StarRatingComponent, DatePipe],
  templateUrl: './hotel-detail-modal.component.html',
})
export class HotelDetailModalComponent {
  private readonly hotelService = inject(HotelService);

  /** Id del hotel a mostrar; null cierra el modal. */
  readonly hotelId = input<string | null>(null);

  /** Se emite cuando el usuario cierra el modal. */
  readonly closed = output<void>();

  protected readonly hotel = signal<Hotel | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly zoomed = signal(false);

  constructor() {
    effect(() => {
      const id = this.hotelId();
      if (!id) {
        this.hotel.set(null);
        this.zoomed.set(false);
        return;
      }
      this.loading.set(true);
      this.error.set(null);
      this.hotelService.getById(id).subscribe({
        next: (hotel) => {
          this.hotel.set(hotel);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el detalle del hotel.');
          this.loading.set(false);
        },
      });
    });
  }

  protected imageUrl(id: string): string {
    return this.hotelService.imageUrl(id);
  }

  protected openZoom(): void {
    this.zoomed.set(true);
  }

  protected closeZoom(): void {
    this.zoomed.set(false);
  }

  protected close(): void {
    this.closed.emit();
  }
}
