// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HotelDetailModalComponent } from './hotel-detail-modal.component';
import { environment } from '../../../environments/environment';
import { Hotel } from '../../domain/hotel.model';

const base = `${environment.apiBaseUrl}/hotels`;

const sample: Hotel = {
  id: 'a1',
  name: 'Cheil Caribe',
  address: 'Bocagrande Cra 1',
  city: 'Cartagena',
  rating: 5,
  description: 'Resort frente al mar con spa.',
  createdAt: '2026-01-01T00:00:00Z',
  hasImage: true,
};

describe('HotelDetailModalComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotelDetailModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('no hace petición cuando hotelId es null', () => {
    const fixture = TestBed.createComponent(HotelDetailModalComponent);
    fixture.componentRef.setInput('hotelId', null);
    fixture.detectChanges();
    httpMock.expectNone(`${base}/a1`);
  });

  it('carga el hotel por id y muestra todos sus campos', async () => {
    const fixture = TestBed.createComponent(HotelDetailModalComponent);
    fixture.componentRef.setInput('hotelId', 'a1');
    fixture.detectChanges();

    httpMock.expectOne(`${base}/a1`).flush(sample);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Cheil Caribe');
    expect(text).toContain('Cartagena');
    expect(text).toContain('Bocagrande Cra 1');
    expect(text).toContain('Resort frente al mar con spa.');
  });

  it('emite closed al cerrar', async () => {
    const fixture = TestBed.createComponent(HotelDetailModalComponent);
    fixture.componentRef.setInput('hotelId', 'a1');
    fixture.detectChanges();
    httpMock.expectOne(`${base}/a1`).flush(sample);
    await fixture.whenStable();
    fixture.detectChanges();

    let closedEmitted = false;
    fixture.componentInstance.closed.subscribe(() => (closedEmitted = true));

    const closeBtn = (fixture.nativeElement as HTMLElement).querySelector(
      'button[aria-label="Cerrar"]',
    ) as HTMLButtonElement;
    closeBtn.click();

    expect(closedEmitted).toBe(true);
  });

  it('al pulsar la imagen abre el lightbox a pantalla completa', async () => {
    const fixture = TestBed.createComponent(HotelDetailModalComponent);
    fixture.componentRef.setInput('hotelId', 'a1');
    fixture.detectChanges();
    httpMock.expectOne(`${base}/a1`).flush(sample);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const cover = host.querySelector('img.cursor-zoom-in') as HTMLImageElement;
    expect(cover).toBeTruthy();

    cover.click();
    fixture.detectChanges();

    expect(host.querySelector('[aria-label="Imagen completa"]')).toBeTruthy();
  });
});
