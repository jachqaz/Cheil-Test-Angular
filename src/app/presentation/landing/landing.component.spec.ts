// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LandingComponent } from './landing.component';
import { environment } from '../../../environments/environment';
import { Hotel } from '../../domain/hotel.model';

const base = `${environment.apiBaseUrl}/hotels`;

const hotels: Hotel[] = [
  { id: 'a', name: 'Cheil Caribe', address: 'x', city: 'Cartagena', rating: 5, description: null, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'b', name: 'Cheil Andino', address: 'y', city: 'Bogotá', rating: 4, description: null, createdAt: '2026-01-01T00:00:00Z' },
];

describe('LandingComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('carga y muestra los hoteles al iniciar', async () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    httpMock.expectOne(base).flush(hotels);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Cheil Caribe');
    expect(text).toContain('Cheil Andino');
  });

  it('muestra mensaje de error si la API falla', async () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    httpMock.expectOne(base).error(new ProgressEvent('error'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No se pudieron cargar');
  });
});
