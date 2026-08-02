
import { Component, OnInit } from '@angular/core';
import {
  ImageDetailsDto,
  PrincipalCarouselService,
} from '../../../services/principal-carousel';
import { catchError, of, tap } from 'rxjs';
import { IconComponent } from '../../../ui';

@Component({
    selector: 'app-index-carousel',
    imports: [IconComponent],
    templateUrl: './index-carousel.component.html',
    styleUrl: './index-carousel.component.css'
})
export class IndexCarouselComponent implements OnInit {
  principalCarousel: any[] = [];
  imagesWithLinks: ImageDetailsDto[] = [];

  constructor(
    private readonly getPrincipalCarousel: PrincipalCarouselService
  ) {}

  ngOnInit() {
    this.loadPrincipalCarousel();
  }

  async loadPrincipalCarousel(): Promise<void> {
    const id = 'principal';

    this.getPrincipalCarousel
      .getPrincipalBanner(id)
      .pipe(
        tap((images) => {
          this.imagesWithLinks = images;
        }),
        catchError((error) => {
          console.error('Error al obtener las imágenes:', error);
          return of([]);
        })
      )
      .subscribe();
  }
}
