import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../ui';

@Component({
  standalone: true,
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  imports: [RouterLink, IconComponent],
})
export class CompaniesComponent {}
