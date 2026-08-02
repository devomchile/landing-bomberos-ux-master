import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { GetAllPostsService } from '../../../../services/post';
import { DatePipe, CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LinksHomeComponent } from '../../../../shared/components/links-home/links-home.component';
import { GetAllPostsDto } from '../../../../services/post/get-all-posts/dtos';
import { IconComponent } from '../../../../ui';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css'],
    providers: [DatePipe],
    imports: [CommonModule, LoadingComponent, RouterModule, LinksHomeComponent, IconComponent]
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: GetAllPostsDto[] = [];
  currentPage: number = 1;
  perPage: number = 9;
  totalPages: number = 1;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private readonly postsService: GetAllPostsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = +params['page'];
      if (page && page > 0) {
        this.currentPage = page;
      }
    });
    this.loadPosts();
  }

  loadPosts() {
    this.postsService
      .getPosts(this.currentPage, this.perPage)
      .pipe(
        tap({
          next: ({ posts, totalPages }) => {
            this.posts = posts;
            this.totalPages = totalPages;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching posts', error);
            this.isLoading = false;
          },
        })
      )
      .subscribe();
  }

  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    return formattedDate ? formattedDate : 'Fecha no disponible';
  }

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPosts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPosts();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
