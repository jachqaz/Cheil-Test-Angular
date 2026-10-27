// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/landing/landing.component').then((m) => m.LandingComponent),
    title: 'Cheil Hoteles',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./presentation/admin/admin.component').then((m) => m.AdminComponent),
    title: 'Administración · Cheil Hoteles',
  },
  { path: '**', redirectTo: '' },
];
