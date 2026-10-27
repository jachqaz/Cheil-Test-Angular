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
  **(2026-10-27: documentada en el README del front — sección "Imagen del hotel" + mención en
  Funcionalidades — cerrando la discrepancia con el README del back.)**
- **Tailwind:** justificación técnica añadida al README (sección "¿Por qué Tailwind?").
  Conclusión: se mantiene; Angular Material sería sobre-ingeniería para este alcance.
  **(2026-10-27: sección retirada del README por decisión del director; la justificación se
  transmitió directamente en chat, no se documenta.)**

## Bitácora

- **2026-10-27** — Proyecto creado como carpeta vacía. Tracking inicializado en F0.
- **2026-10-27** — F3 completa: admin CRUD + landing usuario + búsqueda, Tailwind, 12 tests
  Vitest verdes, CI con artefacto, README con recomendaciones. Conectado al backend.
- **2026-10-27 (fix)** — `ng serve` fallaba ("file not found in TypeScript compilation" para
  app.ts/app.config.ts/main.ts). Causa: `tsconfig.spec.json` incluía `src/**/*.ts`, lo que
  reclamaba los archivos de la app en dos proyectos de *references* a la vez. Revertido el
  spec a `*.d.ts` + `*.spec.ts` (el fallo original de tests era la ruta de import de
  `environment`, ya corregida, no el include). Dev + prod + 12 tests verdes.
- **2026-10-27 (fix 2)** — el error reaparecía en la terminal del director por caché
  persistente del dev-server. Solución definitiva: declarar `src/main.ts` en `files` de
  `tsconfig.app.json` (como recomienda el propio mensaje de Angular); fuerza la inclusión del
  punto de entrada, elimina el warning de main.ts y hace la config inmune a la caché. Se borra
  `.angular` y `ng serve` arranca limpio. Verificado: serve + build prod + 12 tests OK.
- **2026-10-27 (fix 3 — CAUSA RAÍZ)** — el error seguía porque el director ejecutaba desde
  `C:\Users\Johan\IdeaProjects\...`, que es un **junction a `D:\IdeaProjects`**. El compilador
  de Angular no concilia las rutas entre la letra C: del junction y la D: real → "file not
  found in TypeScript compilation". Reproducido: falla desde C:, OK desde D:. FIX definitivo:
  `preserveSymlinks: true` en `angular.json` (options del builder) → `ng serve` arranca limpio
  **desde cualquiera de las dos letras**. Mismo patrón de junction C:/D: que afectó a Topaz.
  Verificado desde C: (junction) y D: (real): serve + build prod + 12 tests OK.
