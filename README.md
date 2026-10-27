<!--
  Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
  All rights reserved.
-->

# Cheil Hotels — Frontend (Angular 22)

Aplicación web para la gestión y búsqueda de una cadena de hoteles. Ofrece un panel de
**Administrador** (CRUD de hoteles) y una **landing de Usuario** con listado y búsqueda por
nombre o calificación, consumiendo la API REST del backend.

## Modelo de trabajo: orquestación humano + agente

Construido bajo **orquestación dirigida de IA**: un ingeniero define la arquitectura, los
patrones y el criterio de UI/UX; un agente los ejecuta con evidencia y trazabilidad.

- **Director de orquesta — Johan Castano (`jachqaz`).** Fija el stack (Angular 22, Signals,
  Tailwind), la **Clean Architecture** del front, el patrón **MVVM**, la estrategia de
  pruebas y la política de control de versiones (commits firmados, con preprocesado, y
  publicación revisada por el responsable).
- **Agente ejecutor — Kiro (modelo Auto).** Implementa componentes, servicios y pruebas, y
  verifica contra `build` y `test`. Trabaja guiado, dentro de las decisiones del director.

La trazabilidad vive en `TRACKING.md`.

## Stack

- Angular 22 · standalone components · **Signals** (MVVM) · new control flow
- **Tailwind CSS** · Reactive Forms · HttpClient
- **Vitest** (pruebas unitarias) · TypeScript estricto
- GitHub Actions (CI → artefacto `dist/`)

## Arquitectura (Clean Architecture + MVVM)

```
src/app/
├─ domain/            # modelo de dominio (Hotel, HotelInput, HotelFilter)
├─ data/              # HotelService: único acceso HTTP a la API (adaptador)
├─ presentation/      # vistas (ViewModel = signals)
│  ├─ landing/        # Usuario: intro + listado + búsqueda + modal de detalle
│  ├─ admin/          # Administrador: CRUD con formulario reactivo
│  └─ shared/         # StarRating y HotelDetailModal (presentacionales reutilizables)
└─ app.{ts,html,routes,config}   # shell, navegación y DI
src/environments/     # apiBaseUrl por entorno
```

Las vistas no conocen HTTP: dependen del `HotelService`. El `ViewModel` de cada pantalla
son **signals** dentro del componente (patrón MVVM con la reactividad nativa de Angular).

## Funcionalidades

- **Usuario (`/`):** introducción a la cadena, listado de hoteles en tarjetas (con imagen de
  portada o un placeholder si no tiene), búsqueda por nombre y por calificación mínima.
  Responsiva (grid → columna en móvil). Al **hacer clic en una tarjeta** se abre un modal de
  **detalle** con la imagen y todos los campos del hotel; dentro del modal, **pulsar la imagen**
  la muestra a pantalla completa.
- **Administrador (`/admin`):** crear, listar, editar y eliminar hoteles con formulario
  reactivo validado y confirmación de borrado, incluida la **subida de imagen** del hotel.

## Detalle del hotel (preview)

Al pulsar una tarjeta de la landing, `LandingComponent` fija el id seleccionado y renderiza
`HotelDetailModalComponent` (en `presentation/shared`), siguiendo Clean Architecture + MVVM:

- **Carga desde la API.** El modal recibe el `hotelId` como `input` y, mediante un `effect`,
  llama a `HotelService.getById(id)` para traer el detalle del backend (no reutiliza el objeto
  del listado). El estado (`hotel`, `loading`, `error`, `zoomed`) vive en signals.
- **Contenido.** Muestra la imagen de portada y todos los campos: nombre, ciudad, dirección,
  calificación (estrellas + `N/5`), descripción y fecha de registro.
- **Lightbox.** Pulsar la imagen abre una capa a pantalla completa (`object-contain`, fondo
  oscuro) que se cierra con clic o con el botón de cerrar.
- **Accesibilidad.** La tarjeta es operable por teclado (`role="button"`, Enter/Espacio, anillo
  de foco); el modal y el lightbox usan `role="dialog"` / `aria-modal`.

## Imagen del hotel

La optimización de la imagen (peso máximo de 400 KB conservando la máxima calidad) es
responsabilidad del backend —resize + compresión JPEG; ver el README del backend—. El front
envía el archivo original y delega esa optimización en el servidor, que es la única fuente de
verdad del límite.

- **Subida (admin).** El formulario incluye un `<input type="file">`
  (`accept="image/jpeg,image/png,image/webp"`). Al guardar un hotel, si se seleccionó archivo,
  `HotelService.uploadImage(id, file)` lo envía como `multipart/form-data` (campo `file`) con
  `PUT /api/hotels/{id}/image`. La subida se **encadena después** de crear/editar el hotel; si
  el hotel se guarda pero la imagen falla, se muestra un aviso específico sin perder el alta.
- **Visualización (usuario).** Cada tarjeta usa `HotelService.imageUrl(id)` como `src` de un
  `<img>` cuando `hotel.hasImage` es `true`; si no, muestra un placeholder. El DTO expone solo
  `hasImage` (bool), no los bytes, para que el listado sea liviano; la imagen se solicita
  aparte por su URL (`GET /api/hotels/{id}/image`) y el navegador la cachea.
- **Límite no acoplado al cliente.** El tope de 400 KB no se valida en el front: la regla
  reside en un único lugar (el servidor), de modo que el cliente no queda desincronizado si
  cambia.

## Ejecución

```bash
vfox use node@24      # o, sin vfox: usar Node 24 LTS instalado en el sistema
npm install
npm start           # http://localhost:4200
```

> Requiere **Node 24 LTS**. Si usas vfox, `vfox use node@24` fija la versión en la sesión; si
> no, basta con tener Node 24 en el `PATH` (p. ej. instalado con nvm o desde nodejs.org).
> Requiere el backend arriba en `http://localhost:5132` (ver `Cheil-Test-Net`). La URL de la
> API se configura en `src/environments/environment.ts`.

## Conexión con el backend

`environment.ts` apunta a `http://localhost:5132/api`. El backend habilita CORS para
`http://localhost:4200`. Flujo: **Angular → API .NET → SQLite**. Para probar de extremo a
extremo: arranca el backend, luego `npm start`, abre `/` (usuario) y `/admin`.

## Pruebas

```bash
npm test            # Vitest
```

16 pruebas: servicio HTTP (`HttpTestingController`), landing (carga y error), admin (listado,
validación, creación) y modal de detalle (carga por id, cierre y lightbox).

## CI/CD

`.github/workflows/ci.yml`: en cada `push`/`PR` a `develop`/`master` → `npm ci`, pruebas con
cobertura y build de producción publicado como artefacto `dist/`. La cobertura usa
`@vitest/coverage-v8` (devDependency requerida por `ng test --coverage`).

## Recomendaciones y evolución

> El alcance actual prioriza una interfaz clara y responsiva. Las siguientes líneas de
> evolución no están implementadas todavía; se documentan como criterio de ingeniería frontend
> para llevar la aplicación a un producto en producción.

1. **Autenticación del administrador.** El panel `/admin` hoy es abierto. En producción lo
   protegería con un `AuthGuard` + token (JWT/OIDC) y un interceptor que adjunte el `Bearer`,
   separando la sesión de administrador de la vista pública.
2. **Gestión de estado y caché.** Para más vistas introduciría un store con signals (o NgRx
   SignalStore) y caché de peticiones con invalidación, evitando recargar la lista completa
   tras cada mutación.
3. **UX de datos.** Paginación/scroll infinito, *debounce* en el buscador, *skeletons* de
   carga, *optimistic updates* y *toasts* de confirmación en lugar de `confirm()` nativo.
4. **Accesibilidad e i18n.** Auditoría WCAG (focus, roles ARIA, contraste), navegación por
   teclado completa e internacionalización con `@angular/localize` o `ngx-translate`
   (español/inglés), como en proyectos de referencia.
5. **Calidad y DX.** ESLint + Prettier como gate en CI, cobertura mínima bloqueante, pruebas
   e2e (Playwright) para los flujos admin/usuario y Storybook para los componentes compartidos.
6. **Entrega.** Despliegue del artefacto `dist/` en un CDN/estático (GitHub Pages, S3+CloudFront)
   con `base-href` por entorno y verificación de *bundle budget* en el pipeline.

Cada línea es un *trade-off* consciente, priorizando claridad y un alcance acotado.

---
_Desarrollado con asistencia de Kiro AI (modelo Auto) bajo la dirección de Johan Castano (jachqaz)._
