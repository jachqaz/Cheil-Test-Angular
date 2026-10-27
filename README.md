<!--
  Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
  All rights reserved.
-->

# Cheil Hotels — Frontend (Angular 22)

Aplicación web para la cadena de hoteles Cheil. Resuelve el **Ejercicio 2** de la prueba
técnica NTS: un panel de **Administrador** (CRUD de hoteles) y una **landing de Usuario**
con listado y búsqueda por nombre o calificación. Consume la API REST del backend.

## Modelo de trabajo: orquestación humano + agente

Construido bajo **orquestación dirigida de IA**: un ingeniero define la arquitectura, los
patrones y el criterio de UI/UX; un agente los ejecuta con evidencia y trazabilidad.

- **Director de orquesta — Johan Castano (`jachqaz`).** Fija el stack (Angular 22, Signals,
  Tailwind), la **Clean Architecture** del front, el patrón **MVVM**, la estrategia de
  pruebas y la política de commits (firmados, con preprocesado, sin push automático).
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
│  ├─ landing/        # Usuario: intro + listado + búsqueda
│  ├─ admin/          # Administrador: CRUD con formulario reactivo
│  └─ shared/         # StarRating (presentacional reutilizable)
└─ app.{ts,html,routes,config}   # shell, navegación y DI
src/environments/     # apiBaseUrl por entorno
```

Las vistas no conocen HTTP: dependen del `HotelService`. El `ViewModel` de cada pantalla
son **signals** dentro del componente (patrón MVVM con la reactividad nativa de Angular).

## Funcionalidades

- **Usuario (`/`):** introducción a la cadena, listado de hoteles en tarjetas, búsqueda por
  nombre y por calificación mínima. Responsiva (grid → columna en móvil).
- **Administrador (`/admin`):** crear, listar, editar y eliminar hoteles con formulario
  reactivo validado y confirmación de borrado.

## Ejecución

```bash
vfox use node@24
npm install
npm start           # http://localhost:4200
```

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

12 pruebas: servicio HTTP (`HttpTestingController`), landing (carga y error) y admin (listado,
validación, creación).

## CI/CD

`.github/workflows/ci.yml`: en cada `push`/`PR` a `develop`/`master` → `npm ci`, pruebas con
cobertura y build de producción publicado como artefacto `dist/`.

## Recomendaciones (fuera del alcance de la prueba)

> El enunciado pide una UI sencilla y responsiva, sin diseño avanzado. Las siguientes mejoras
> **no se implementaron** para respetar ese alcance; se documentan como criterio de ingeniería
> frontend para un producto real.

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

Son *trade-offs* conscientes: el ejercicio prioriza claridad y alcance acotado.

---
_Desarrollado con asistencia de Kiro AI (modelo Auto) bajo la dirección de Johan Castano (jachqaz)._
