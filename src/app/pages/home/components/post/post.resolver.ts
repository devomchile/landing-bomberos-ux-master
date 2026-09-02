import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GetPostService } from '../../../../services/post/get-post';

export const postResolver: ResolveFn<any> = (route) => {
  const slug = route.paramMap.get('slug-noticia');
  if (slug) {
    return inject(GetPostService).getPostBySlug(slug);
  }
  return null;
};
