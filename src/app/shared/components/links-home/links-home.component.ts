import { Component, OnInit } from '@angular/core';
import { BannersAndPromotionsService } from '../../../services/banners-and-promotions';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../ui';
import { LoadingComponent } from '../../../pages/home/components/loading/loading.component';

@Component({
    selector: 'app-links-home',
    templateUrl: './links-home.component.html',
    styleUrls: ['./links-home.component.css'],
    imports: [CommonModule, IconComponent, LoadingComponent]
})
export class LinksHomeComponent implements OnInit {
  bannersAndPromotions: any[] = [];
  imagesWithLinks1: { src: string; link: string; id: number; alt: string }[] = [];
  imagesWithLinks2: { src: string; link: string; id: number; alt: string }[] = [];
  imagesWithLinks3: { src: string; link: string; id: number; alt: string }[] = [];
  isLoading = true;
  private loadedCount = 0;

  constructor(
    private readonly getBannersAndPromotions: BannersAndPromotionsService
  ) {}

  ngOnInit() {
    this.loadBannersAndPromotions1();
    this.loadBannersAndPromotions2();
    this.loadBannersAndPromotions3();
  }

  async loadBannersAndPromotions1(): Promise<void> {
    const id = 1;
    (await this.getBannersAndPromotions.getBannersAndPromotions(id)).subscribe({
      next: (data) => this.extractImagesAndLinks1(data),
      error: () => {},
      complete: () => this.#markLoaded(),
    });
  }

  async loadBannersAndPromotions2(): Promise<void> {
    const id = 2;
    (await this.getBannersAndPromotions.getBannersAndPromotions(id)).subscribe({
      next: (data) => this.extractImagesAndLinks2(data),
      error: () => {},
      complete: () => this.#markLoaded(),
    });
  }

  async loadBannersAndPromotions3(): Promise<void> {
    const id = 3;
    (await this.getBannersAndPromotions.getBannersAndPromotions(id)).subscribe({
      next: (data) => this.extractImagesAndLinks3(data),
      error: () => {},
      complete: () => this.#markLoaded(),
    });
  }

  #markLoaded(): void {
    this.loadedCount++;
    if (this.loadedCount >= 3) {
      this.isLoading = false;
    }
  }

  extractImagesAndLinks1(data: any): void {
    this.imagesWithLinks1 = [];
    data.forEach((item1: any) => {
      if (item1.content && item1.content.rendered) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(item1.content.rendered, 'text/html');
        doc.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
          const href = a.getAttribute('href');
          a.querySelectorAll('img').forEach((img: HTMLImageElement) => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            if (src && href) {
              this.imagesWithLinks1.push({ src, link: href, alt, id: 0 });
            }
          });
        });
      }
    });
  }

  extractImagesAndLinks2(data: any): void {
    this.imagesWithLinks2 = [];
    data.forEach((item1: any) => {
      if (item1.content && item1.content.rendered) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(item1.content.rendered, 'text/html');
        doc.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
          const href = a.getAttribute('href');
          a.querySelectorAll('img').forEach((img: HTMLImageElement) => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            if (src && href) {
              this.imagesWithLinks2.push({ src, link: href, alt, id: 0 });
            }
          });
        });
      }
    });
  }

  extractImagesAndLinks3(data: any): void {
    this.imagesWithLinks3 = [];
    data.forEach((item1: any) => {
      if (item1.content && item1.content.rendered) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(item1.content.rendered, 'text/html');
        doc.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
          const href = a.getAttribute('href');
          a.querySelectorAll('img').forEach((img: HTMLImageElement) => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            if (src && href) {
              this.imagesWithLinks3.push({ src, link: href, alt, id: 0 });
            }
          });
        });
      }
    });
  }
}
