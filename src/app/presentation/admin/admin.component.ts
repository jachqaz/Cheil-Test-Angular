// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelService } from '../../data/hotel.service';
import { Hotel } from '../../domain/hotel.model';
import { StarRatingComponent } from '../shared/star-rating.component';

/**
 * Panel de administración (MVVM): CRUD de hoteles — crear, listar, editar y eliminar.
 * Formulario reactivo con validación; estado en signals.
 */
@Component({
  selector: 'app-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, StarRatingComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  private readonly hotelService = inject(HotelService);
  private readonly fb = inject(FormBuilder);

  protected readonly hotels = signal<Hotel[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);
  protected selectedFile: File | null = null;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    description: [''],
  });

  constructor() {
    this.load();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  protected load(): void {
    this.loading.set(true);
    this.hotelService.list().subscribe({
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

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const input = this.form.getRawValue();
    const id = this.editingId();
    const request = id ? this.hotelService.update(id, input) : this.hotelService.create(input);
    request.subscribe({
      next: (hotel) => {
        const file = this.selectedFile;
        if (file) {
          this.hotelService.uploadImage(hotel.id, file).subscribe({
            next: () => {
              this.resetForm();
              this.load();
            },
            error: () => this.error.set('El hotel se guardó, pero la imagen no se pudo subir.'),
          });
        } else {
          this.resetForm();
          this.load();
        }
      },
      error: () => this.error.set('No se pudo guardar el hotel.'),
    });
  }

  protected edit(hotel: Hotel): void {
    this.editingId.set(hotel.id);
    this.form.setValue({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      rating: hotel.rating,
      description: hotel.description ?? '',
    });
  }

  protected remove(hotel: Hotel): void {
    if (!confirm(`¿Eliminar el hotel "${hotel.name}"?`)) {
      return;
    }
    this.hotelService.delete(hotel.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('No se pudo eliminar el hotel.'),
    });
  }

  protected resetForm(): void {
    this.editingId.set(null);
    this.selectedFile = null;
    this.form.reset({ name: '', address: '', city: '', rating: 3, description: '' });
  }
}
