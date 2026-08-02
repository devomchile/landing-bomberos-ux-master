import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetPostService } from '../../../../services/post/get-post';
import { DatePipe, CommonModule } from '@angular/common';
import { LinksHomeComponent } from '../../../../shared/components/links-home/links-home.component';
import { RouterModule } from '@angular/router';
import { GetCategoryService } from '../../../../services/resources/get-category.service';
import {
  GetMediaResourceDto,
  GetMediaResourceService,
} from '../../../../services/resources';
import { IconComponent } from '../../../../ui';

@Component({
    selector: 'app-post',
    providers: [DatePipe],
    imports: [CommonModule, RouterModule, LinksHomeComponent, IconComponent],
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  slug!: string;
  item: any;
  categories: string[] = [];
  featuredMedia: GetMediaResourceDto | null = null;
  returnPage = 1;

  constructor(
    private route: ActivatedRoute,
    private getPostService: GetPostService,
    private datePipe: DatePipe,
    private categoryService: GetCategoryService,
    private readonly getMediaResource: GetMediaResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.returnPage = +params['page'] || 1;
    });
    this.route.params.subscribe((params) => {
      this.slug = params['slug-noticia'];
      this.loadPost(this.slug);
    });
  }

  loadPost(slug: string) {
    this.getPostService.getPostBySlug(slug).subscribe((item: any) => {
      this.item = item;
      this.loadCategories(item.categories);
    });
  }

  loadCategories(categoryIds: number[]) {
    if (categoryIds.length > 0) {
      this.categoryService
        .getCategoriesByIds(categoryIds)
        .subscribe((categories: any[]) => {
          this.categories = categories.map((cat) => cat.name);
        });
    }
  }

  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    return formattedDate ? formattedDate : 'Fecha no disponible';
  }
}
