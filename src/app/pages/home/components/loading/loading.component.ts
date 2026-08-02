import { Component } from '@angular/core';
import { IconComponent } from '../../../../ui';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {}
