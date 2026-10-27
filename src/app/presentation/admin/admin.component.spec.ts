// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminComponent } from './admin.component';
import { environment } from '../../../environments/environment';
import { Hotel } from '../../domain/hotel.model';

const base = `${environment.apiBaseUrl}/hotels`;

const existing: Hotel = {
  id: 'a', name: 'Cheil Plaza', address: 'Calle 1', city: 'Bogotá', rating: 5, description: 'Lujo', createdAt: '2026-01-01T00:00:00Z',
};

describe('AdminComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function createComponent() {
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    httpMock.expectOne(base).flush([existing]);
    return fixture;
  }

  it('lista los hoteles al cargar', async () => {
    const fixture = createComponent();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Cheil Plaza');
  });

  it('el formulario es inválido si falta el nombre', () => {
    const fixture = createComponent();
    const component = fixture.componentInstance as unknown as { form: { invalid: boolean } };
    expect(component.form.invalid).toBe(true);
  });

  it('crea un hotel: POST y recarga la lista', async () => {
    const fixture = createComponent();
    const component = fixture.componentInstance as unknown as {
      form: { setValue: (v: unknown) => void };
      submit: () => void;
    };
    component.form.setValue({ name: 'Nuevo Hotel', address: 'Dir 1', city: 'Cali', rating: 4, description: '' });
    component.submit();

    const post = httpMock.expectOne(base);
    expect(post.request.method).toBe('POST');
    post.flush(existing);

    httpMock.expectOne(base).flush([existing]); // recarga
  });
});
