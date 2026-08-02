import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [
        RouterModule,
        CommonModule,
        RouterOutlet,
        ShellComponent,
        NgbModule,
        MatSnackBarModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  menuOption: string = '';

  constructor(private router: Router) {}
  ngOnInit() {
    // Escuchar los eventos de navegación para restaurar el scroll
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Restaurar la posición del scroll a la parte superior en cada navegación
        window.scrollTo(0, 0);
      });
  }

  onOption(menuOption: string) {
    this.menuOption = menuOption;
  }
}
