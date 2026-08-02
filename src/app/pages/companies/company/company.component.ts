import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { LinksStaffComponent } from '../../../shared/components/links-staff/links-staff.component';
import { LinksHomeComponent } from '../../../shared/components/links-home/links-home.component';
import { CompanieService, CompaniesDto } from '../../../services/companies';
import {
  GetMediaResourceDto,
  GetMediaResourceService,
} from '../../../services/resources';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css'],
    imports: [
        RouterOutlet,
        CommonModule,
        RouterModule,
        LinksStaffComponent,
        LinksHomeComponent,
    ]
})
export class CompanyComponent implements OnInit {
  name!: string;
  featuredMedia: GetMediaResourceDto | null = null;
  constructor(
    private route: ActivatedRoute,
    private readonly companiesService: CompanieService,
    private readonly getMediaResource: GetMediaResourceService
  ) {}

  company: any;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.name = params['nombre-company'];
      this.loadCompanyData();
    });
  }

  loadCompanyData(): void {
    const pageId =
      this.name !== 'directorio-general'
        ? `${this.name}-compania`
        : 'directorio-general';
    this.companiesService.getCompanyDetails(pageId).subscribe(
      (data: CompaniesDto[]) => {
        if (data.length > 0) {
          this.company = data[0]; // Asume que obtienes un array y toma el primer elemento

          if (this.company._links && this.company._links['wp:featuredmedia']) {
            const featuredMediaUrl =
              this.company._links['wp:featuredmedia'][0].href;
            this.loadFeaturedImage(featuredMediaUrl);
          }
        }
      },
      (error) => {
        console.error('Error al cargar los datos de la compañía:', error);
      }
    );
  }

  loadFeaturedImage(mediaUrl: string): void {
    this.getMediaResource.getMediaResource(mediaUrl).subscribe(
      (media: GetMediaResourceDto) => {
        this.featuredMedia = media;
      },
      (error) => {
        console.error('Error al cargar la imagen destacada:', error);
      }
    );
  }
}
