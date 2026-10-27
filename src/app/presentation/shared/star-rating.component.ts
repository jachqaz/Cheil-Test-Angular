// Copyright (c) 2026 Johan Castano (jachqaz). Cheil Hotels Frontend.
// All rights reserved.

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Muestra una calificación de 1 a 5 con estrellas. Presentacional y reutilizable. */
@Component({
  selector: 'app-star-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-0.5 text-amber-500" [attr.aria-label]="rating() + ' de 5'">
      @for (star of stars; track star) {
        <span [class.text-slate-300]="star > rating()">★</span>
      }
    </span>
  `,
})
export class StarRatingComponent {
  readonly rating = input.required<number>();
  protected readonly stars = [1, 2, 3, 4, 5];
}
