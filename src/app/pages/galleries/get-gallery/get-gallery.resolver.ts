import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GalleriesService } from '../../../services';

export const getGalleryResolver: ResolveFn<any> = (route) => {
  const slug = route.paramMap.get('slug-noticia');
  if (slug) {
    return inject(GalleriesService).getGalleryBySlug(slug);
  }
  return null;
};
