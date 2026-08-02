import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GalleriesService } from '../../../services';
import {
  GetAllGalleriesDto,
  GalleriesDto,
} from '../../../services/features/gallery/dtos';
import { LinksHomeComponent } from '../../../shared/components/links-home/links-home.component';
import { LinksStaffComponent } from '../../../shared/components/links-staff/links-staff.component';
import { IconComponent } from '../../../ui';

import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../home/components/loading/loading.component';

@Component({
    selector: 'app-get-all-galleries',
    imports: [
    LinksHomeComponent,
    LinksStaffComponent,
    RouterLink,
    IconComponent,
    LoadingComponent
],
    templateUrl: './get-all-galleries.component.html',
    styleUrl: './get-all-galleries.component.css'
})
export class GetAllGalleriesComponent implements OnInit, OnDestroy {
  galleries$: Observable<GetAllGalleriesDto> | undefined;
  galleries: GalleriesDto[] = [];
  currentPage: number = 1;
  perPage: number = 9;
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
