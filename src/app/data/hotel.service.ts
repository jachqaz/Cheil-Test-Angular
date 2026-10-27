// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hotel, HotelFilter, HotelInput } from '../domain/hotel.model';

/**
 * Adaptador de datos: consume la API REST de hoteles.
 * Única puerta de acceso al backend; las vistas dependen de este servicio.
 */
@Injectable({ providedIn: 'root' })
export class HotelService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/hotels`;

  list(filter: HotelFilter = {}): Observable<Hotel[]> {
    let params = new HttpParams();
    if (filter.name?.trim()) {
      params = params.set('name', filter.name.trim());
    }
    if (filter.minRating != null) {
      params = params.set('minRating', filter.minRating);
    }
    return this.http.get<Hotel[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.baseUrl}/${id}`);
  }

  create(input: HotelInput): Observable<Hotel> {
    return this.http.post<Hotel>(this.baseUrl, input);
  }

  update(id: string, input: HotelInput): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.baseUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** URL absoluta de la imagen de portada de un hotel (para usar en <img src>). */
  imageUrl(id: string): string {
    return `${this.baseUrl}/${id}/image`;
  }

  /** Sube/actualiza la imagen de portada; el backend la optimiza a <= 400 KB. */
  uploadImage(id: string, file: File): Observable<Hotel> {
    const form = new FormData();
    form.append('file', file);
    return this.http.put<Hotel>(`${this.baseUrl}/${id}/image`, form);
  }
}
