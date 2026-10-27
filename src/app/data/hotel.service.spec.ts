// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HotelService } from './hotel.service';
import { environment } from '../../environments/environment';
import { Hotel } from '../domain/hotel.model';

const base = `${environment.apiBaseUrl}/hotels`;

const sample: Hotel = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Cheil Plaza',
  address: 'Calle 1',
  city: 'Bogotá',
  rating: 5,
  description: 'Lujo',
  createdAt: '2026-01-01T00:00:00Z',
};

describe('HotelService', () => {
  let service: HotelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HotelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('list() sin filtros llama al endpoint base', () => {
    service.list().subscribe((hotels) => expect(hotels).toEqual([sample]));
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush([sample]);
  });

  it('list() envía name y minRating como query params', () => {
    service.list({ name: 'caribe', minRating: 4 }).subscribe();
    const req = httpMock.expectOne((r) => r.url === base);
    expect(req.request.params.get('name')).toBe('caribe');
    expect(req.request.params.get('minRating')).toBe('4');
    req.flush([]);
  });

  it('create() hace POST con el cuerpo', () => {
    const input = { name: 'Nuevo', address: 'a', city: 'c', rating: 4 };
    service.create(input).subscribe((h) => expect(h.id).toBe(sample.id));
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(sample);
  });

  it('update() hace PUT al id', () => {
    const input = { name: 'Edit', address: 'a', city: 'c', rating: 3 };
    service.update(sample.id, input).subscribe();
    const req = httpMock.expectOne(`${base}/${sample.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(sample);
  });

  it('delete() hace DELETE al id', () => {
    service.delete(sample.id).subscribe();
    const req = httpMock.expectOne(`${base}/${sample.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
