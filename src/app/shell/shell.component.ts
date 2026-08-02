import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../services/commons/theme/theme.service';
import { IconComponent } from '../ui';

@Component({
  standalone: true,
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  imports: [RouterModule, RouterOutlet, CommonModule, NgbModule, IconComponent],
})
export class ShellComponent {
  readonly themeService = inject(ThemeService);
  readonly currentYear = new Date().getFullYear();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeMobileMenu();
      }
    });
  }

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
