import { Injectable, inject, signal, effect, DOCUMENT } from '@angular/core';


export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-preference';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly #document = inject(DOCUMENT);
  readonly #html = this.#document.documentElement;

  readonly mode = signal<ThemeMode>(this.#getStoredTheme());

  readonly #mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  readonly #isDark = signal(this.#resolveIsDark());

  constructor() {
    this.#apply();

    effect(() => {
      const _ = this.mode();
      this.#save();
      this.#apply();
    });

    this.#mediaQuery.addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.#apply();
      }
    });
  }

  toggle(): void {
    const current = this.mode();
    const next: ThemeMode =
      current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.mode.set(next);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  get isDark(): boolean {
    return this.#resolveIsDark();
  }

  get icon(): string {
    const m = this.mode();
    if (m === 'dark') return 'dark_mode';
    if (m === 'light') return 'light_mode';
    return 'hdr_auto';
  }

  #resolveIsDark(): boolean {
    const m = this.mode();
    if (m === 'dark') return true;
    if (m === 'light') return false;
    return this.#mediaQuery.matches;
  }

  #apply(): void {
    const dark = this.#resolveIsDark();
    if (dark) {
      this.#html.setAttribute('data-theme', 'dark');
    } else {
      this.#html.setAttribute('data-theme', 'light');
    }
  }

  #getStoredTheme(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      /* localStorage not available */
    }
    return 'system';
  }

  #save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, this.mode());
    } catch {
      /* localStorage not available */
    }
  }
}
