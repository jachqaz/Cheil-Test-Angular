<!--
  SPDX-License-Identifier: MIT
  Copyright (c) 2026 Johan Castano (jachqaz)
-->

# TRACKING — Cheil-Test-Angular (Frontend Angular 22)

> Trazabilidad del frontend. Estados: **TODO** / **IN_PROGRESS** / **FINISH**.

## Stack

- Angular 22 (CLI 22.2.4, Node vfox v24.22.0), standalone components, Reactive Forms.
- Cliente HTTP hacia la API de `Cheil-Test-Net`.
- Estilos: **PENDIENTE** (decisión del director). UI responsiva (sin diseño avanzado).

## Requisitos funcionales (de `Development Test.md`)

### Administrador

| # | Funcionalidad | Estado |
| --- | --- | --- |
| A1 | Crear hoteles | FINISH |
| A2 | Listar hoteles | FINISH |
| A3 | Editar hoteles | FINISH |
| A4 | Eliminar hoteles | FINISH |

### Usuario

| # | Funcionalidad | Estado |
| --- | --- | --- |
| U1 | Landing con introducción a la cadena | FINISH |
| U2 | Listar todos los hoteles | FINISH |
| U3 | Buscar por nombre | FINISH |
| U4 | Buscar por calificación | FINISH |

## Requisitos no funcionales

| # | Ítem | Estado |
| --- | --- | --- |
| NA1 | Consumo de la API (servicio HTTP, entornos) | FINISH |
| NA2 | Responsividad (cualquier pantalla) | FINISH |
| NA3 | Separación Admin / Usuario (rutas) | FINISH |
| NA4 | Pruebas unitarias | FINISH (12 Vitest) |
| NA5 | Build final en verde | FINISH |

## Decisiones

- Estilos: **Tailwind CSS** (patrón del referente Ceiba verificado).
- Estado: **Signals** (MVVM) con la reactividad nativa de Angular 22.

## Avance 2026-10-27 (F3 frontend, rama develop)

- **Clean Architecture + MVVM:** `domain` (modelo Hotel), `data` (`HotelService` HTTP),
  `presentation` (landing usuario, admin CRUD, StarRating compartido). Signals como ViewModel.
- **Usuario (`/`):** intro + listado en tarjetas + búsqueda por nombre y calificación mínima,
  responsiva.
- **Admin (`/admin`):** CRUD con Reactive Forms validado y confirmación de borrado.
- **Conexión back:** `environment.ts` → `http://localhost:5132/api`; CORS habilitado en el
  backend para `http://localhost:4200`.
- **Tailwind** configurado (`tailwind.config.js`, `.postcssrc.json`, `styles.css`).
- **Pruebas (12 Vitest, verdes):** `HotelService` (GET/POST/PUT/DELETE + params), landing
  (carga/error), admin (listado/validación/creación).
- **CI:** `.github/workflows/ci.yml` → `npm ci` + test:ci + build:prod → artefacto `dist/`.
- **README:** modelo director de orquesta + sección "Recomendaciones".
- **Verificación:** `ng build --configuration production` OK; `ng test` 12/12.
- **Nota:** ejecutar siempre desde `D:\IdeaProjects\Cheil` (no por junction C:).

## Avance 2026-10-27 (imagen + justificación Tailwind)

- **Imagen del hotel:** `hasImage` en el modelo; `HotelService.imageUrl()` y `uploadImage()`.
  Landing muestra la imagen (`<img>` o placeholder). Admin permite subir imagen (input file,
  el backend la optimiza a ≤ 400 KB). Build prod OK, 12 tests Vitest verdes.
- **Tailwind:** justificación técnica añadida al README (sección "¿Por qué Tailwind?").
  Conclusión: se mantiene; Angular Material sería sobre-ingeniería para este alcance.

## Bitácora

- **2026-10-27** — Proyecto creado como carpeta vacía. Tracking inicializado en F0.
- **2026-10-27** — F3 completa: admin CRUD + landing usuario + búsqueda, Tailwind, 12 tests
  Vitest verdes, CI con artefacto, README con recomendaciones. Conectado al backend.
