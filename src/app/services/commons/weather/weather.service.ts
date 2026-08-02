import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, timer, switchMap } from 'rxjs';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly lat = -39.54;
  private readonly lon = -72.51;

  readonly current$: Observable<WeatherData> = timer(0, 30 * 60 * 1000).pipe(
    switchMap(() => this.http.get<any>(this.#buildUrl())),
    map((res: any): WeatherData => ({
      temperature: res.current?.temperature_2m ?? 0,
      humidity: res.current?.relative_humidity_2m ?? 0,
      windSpeed: res.current?.wind_speed_10m ?? 0,
      uvIndex: res.current?.uv_index ?? 0,
    })),
    catchError((): Observable<WeatherData> =>
      of({ temperature: 0, humidity: 0, windSpeed: 0, uvIndex: 0 })
    ),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  #buildUrl(): string {
    const params = new URLSearchParams({
      latitude: String(this.lat),
      longitude: String(this.lon),
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,precipitation',
      timezone: 'America/Santiago',
    });
    return `https://api.open-meteo.com/v1/forecast?${params}`;
  }
}
