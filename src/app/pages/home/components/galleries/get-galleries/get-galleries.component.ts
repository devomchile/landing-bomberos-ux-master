import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GalleriesService } from '../../../../../services';
import {
  GalleriesDto,
  GetAllGalleriesDto,
} from '../../../../../services/features/gallery/dtos';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../../../../ui';

@Component({
    selector: 'app-get-galleries',
    templateUrl: './get-galleries.component.html',
    styleUrls: ['./get-galleries.component.css'],
    imports: [CommonModule, LoadingComponent, RouterModule, IconComponent]
})
export class GetGalleriesComponent implements OnInit, OnDestroy {
  galleries$: Observable<GetAllGalleriesDto> | undefined;
  galleries: GalleriesDto[] = [];
  currentPage: number = 1;
  perPage: number = 6;
  totalPages: number = 1;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(private readonly galleryService: GalleriesService) {}

  ngOnInit(): void {
    this.loadGalleries();
  }

  loadGalleries(): void {
    this.galleries$ = this.galleryService.getAllGalleries(
      this.currentPage,
      this.perPage
    );
    this.subscription.add(
      this.galleries$.subscribe({
        next: ({ data, pagination }) => {
          this.galleries = data;
          this.totalPages = pagination.total_pages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar galerías', err);
          this.isLoading = false;
        },
      })
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGalleries();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGalleries();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
