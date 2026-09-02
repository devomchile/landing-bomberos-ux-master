import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WeatherService,
  WeatherData,
} from '../../../services/commons/weather/weather.service';
import { IconComponent } from '../icon/icon.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'ui-weather-chip',
    imports: [CommonModule, IconComponent],
    template: `
    <div class="weather-chip">
      <span class="weather-item">
        <ui-icon name="thermostat" size="20px" color="white"></ui-icon>
        <span>{{ (data$ | async)?.temperature ?? '--' }}°C</span>
      </span>
      <span class="weather-item">
        <ui-icon name="humidity_percentage" size="20px" color="white"></ui-icon>
        <span>{{ (data$ | async)?.humidity ?? '--' }}%</span>
      </span>
      <span class="weather-item">
        <ui-icon name="air" size="20px" color="white"></ui-icon>
        <span>{{ (data$ | async)?.windSpeed ?? '--' }} km/h</span>
      </span>
      <span
        class="weather-item weather-uv"
        [class.uv-high]="((data$ | async)?.uvIndex ?? 0) >= 6"
      >
        <ui-icon name="wb_sunny" size="20px" color="white"></ui-icon>
        <span>UV {{ (data$ | async)?.uvIndex ?? '--' }}</span>
      </span>
    </div>
  `,
    styles: [
        `
      :host {
        display: block;
      }
      .weather-chip {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        padding: 1rem 0;
        flex-wrap: wrap;
      }
      .weather-item {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.85rem;
        font-weight: 500;
        color: white;
        padding: 0.4rem 0.9rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 2rem;
      }
      .weather-uv.uv-high {
        background: rgba(255, 152, 0, 0.3);
        border-color: rgba(255, 152, 0, 0.4);
      }
      @media (max-width: 767.98px) {
        .weather-chip {
          gap: 0.5rem;
        }
        .weather-item {
          font-size: 0.75rem;
          padding: 0.3rem 0.7rem;
          gap: 0.25rem;
        }
      }
    `,
    ]
})
export class WeatherChipComponent {
  readonly weather = inject(WeatherService);
  readonly data$: Observable<WeatherData> = this.weather.current$;
}
