import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-icon',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="material-symbols-rounded ui-icon-font"
      [style.font-size]="size"
      [style.color]="color"
      [style.opacity]="opacity"
      [style.font-variation-settings]="variationSettings()"
    >
      {{ name }}
    </span>
  `,
  styles: [
    `
      ui-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        line-height: 1;
      }
      .ui-icon-font {
        font-family: 'Material Symbols Rounded' !important;
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
        user-select: none;
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name = '';
  @Input() size = '24px';
  @Input() color?: string;
  @Input() opacity?: number;
  @Input() filled = false;
  @Input() weight = 400;

  variationSettings(): string {
    return `'FILL' ${this.filled ? 1 : 0}, 'wght' ${this.weight}, 'GRAD' 0, 'opsz' 24`;
  }
}
