import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GalleriesService } from '../../../services';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LinksHomeComponent } from '../../../shared/components/links-home/links-home.component';
import { LoadingComponent } from '../../home/components/loading/loading.component';
import { IconComponent } from '../../../ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalComponent } from './feature/image-modal';
import {
  GalleryInfoDto,
  GetGalleryByIdDto,
  ImageGalleryDto,
  PaginationGalleryDto,
} from '../../../services/features/gallery/dtos';

@Component({
    selector: 'app-get-gallery',
    imports: [
        CommonModule,
        RouterLink,
        IconComponent,
        LinksHomeComponent,
        LoadingComponent,
        ImageModalComponent,
    ],
    templateUrl: './get-gallery.component.html',
    styleUrls: ['./get-gallery.component.css']
})
export class GetGalleryComponent implements OnInit, OnDestroy {
  gallery$: Observable<GetGalleryByIdDto> | undefined;
  gallery: GalleryInfoDto | null = null;
  dataImage: Readonly<ImageGalleryDto[]> | null = null;
  currentPage: number = 1;
  perPage: number = 30;
  totalPages: number = 1;
  isLoading: boolean = true;
  galleryId: number = 0;
  modalImage: string = '';
  pagination: PaginationGalleryDto | null = null;
  private destroy$ = new Subject<void>();
  private modalService = inject(NgbModal);

  private subscription: Subscription = new Subscription();

  constructor(
    private readonly galleryService: GalleriesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.perPage;
      this.galleryId = params['id'];
      this.loadGallery();
    });
  }

  loadGallery(): void {
    this.isLoading = true;
    this.gallery$ = this.galleryService.getGalleryById(
      this.galleryId,
      this.currentPage,
      this.perPage
    );
    this.subscription.add(
      this.gallery$.subscribe({
        next: (gallery) => {
          console.log(gallery.gallery);
          this.gallery = gallery.gallery;
          this.dataImage = gallery.images;
          this.pagination = gallery.pagination;
          this.totalPages = gallery.pagination.total_pages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar la galería', err);
          this.isLoading = false;
        },
      })
    );
  }

  openModal(imageUrl: string, imageTitle: string): void {
    const modalRef = this.modalService.open(ImageModalComponent, {
      backdrop: true,
      keyboard: true,
      centered: true,
      animation: true,
      size: 'xl',
    });
    modalRef.componentInstance.imageUrl = imageUrl;
    modalRef.componentInstance.imageTitle = imageTitle;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGallery();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGallery();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.modalService.dismissAll();
    this.subscription.unsubscribe();
  }
}
