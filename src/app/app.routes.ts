import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// import { ProductsComponent } from './pages/products/products.component';
// import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CompaniesComponent } from './pages/companies/companies/companies.component';
import { DirectoryComponent } from './pages/companies/company/directory/directory.component';
import { CompanyComponent } from './pages/companies/company/company.component';
import { MachinesComponent } from './pages/companies/company/machines/machines.component';
import { VolunteersComponent } from './pages/companies/company/volunteers/volunteers.component';
import { PostsComponent } from './pages/home/components/posts/posts.component';
import { PostComponent } from './pages/home/components/post/post.component';
import { postResolver } from './pages/home/components/post/post.resolver';
import { GetAllGalleriesComponent } from './pages/galleries/get-all-galleries/get-all-galleries.component';
import { GetGalleryComponent } from './pages/galleries/get-gallery/get-gallery.component';
import { getGalleryResolver } from './pages/galleries/get-gallery/get-gallery.resolver';
import { DonationComponent } from './pages/donations/donation/donation.component';
import { DonationSuccessComponent } from './pages/donations/donation/features/donation-success/donation-success.component';
import { DonationErrorComponent } from './pages/donations/donation/features/donation-error/donation-error.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Bomberos UI' } },
  {
    path: 'inicio',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'companies',
    children: [
      {
        path: '',
        component: CompaniesComponent,
      },
      {
        path: ':nombre-company',
        component: CompanyComponent,
        data: { title: 'Compañía' },
      },
      {
        path: 'directory/:nombre-company',
        component: DirectoryComponent,
        data: { title: 'Directorio' },
      },
      {
        path: 'machines/:nombre-company',
        component: MachinesComponent,
        data: { title: 'Machines' },
      },
      {
        path: 'volunteers/:nombre-company',
        component: VolunteersComponent,
        data: { title: 'Machines' },
      },
    ],
  },
  {
    path: 'novedades',
    component: PostsComponent,
    data: { title: 'Novedades Bomberos Malalhue' },
  },
  {
    path: 'noticia/:slug-noticia',
    component: PostComponent,
      resolve: {
        post: postResolver,
      },
  },
  {
    path: 'galerias',
    children: [
      {
        path: '',
        component: GetAllGalleriesComponent,
      },
      {
        path: ':id',
        component: GetGalleryComponent,
        resolve: {
          gallery: getGalleryResolver,
        },
      },
    ],
  },
  {
    path: 'donaciones',
    children: [
      {
        path: '',
        component: DonationComponent,
      },
      {
        path: 'success',
        component: DonationSuccessComponent,
      },
      {
        path: 'error',
        component: DonationErrorComponent,
      },
    ],
  },
];
