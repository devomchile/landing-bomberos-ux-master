import { Component, OnInit } from '@angular/core';
import { CompanieService } from '../../../../services/companies';
import { LinksStaffComponent } from '../../../../shared/components/links-staff/links-staff.component';
import { LinksHomeComponent } from '../../../../shared/components/links-home/links-home.component';
import { ActivatedRoute } from '@angular/router';
import {
  GetMediaResourceDto,
  GetMediaResourceService,
} from '../../../../services/resources';

import { CardInterfaceDto } from '../../../../shared/interfaces/card-volunteer.dto';
import { DirectoryDto } from '../../../../shared/interfaces/directory.dto';
import { ApiTag } from '../../../../services/environments/api-tag/api-tag.enum';
import { IconComponent } from '../../../../ui';
import { LoadingComponent } from '../../../home/components/loading/loading.component';

const iconMap: Record<string, string> = {
  'fa-phone': 'call',
  'fa-envelope': 'mail',
  'fa-whatsapp': 'chat',
  'fa-map-marker-alt': 'location_on',
  'fa-mobile': 'smartphone',
  'fa-globe': 'language',
};

@Component({
    selector: 'app-directory',
    templateUrl: './directory.component.html',
    styleUrls: ['./directory.component.css'],
    imports: [LinksStaffComponent, LinksHomeComponent, IconComponent, LoadingComponent]
})
export class DirectoryComponent implements OnInit {
  items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  nombre!: string;
  name!: string;
  featuredMedia: GetMediaResourceDto | null = null;
  directory: any = {};
  businessCards: CardInterfaceDto[] = [];
  isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private directoryService: CompanieService,
    private readonly getMediaResource: GetMediaResourceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.name = params['nombre-company'];
      this.loadDirectoryData();
    });
  }

  getIconName(faClass: string): string {
    if (!faClass) return 'circle';
    for (const [fa, material] of Object.entries(iconMap)) {
      if (faClass.includes(fa)) return material;
    }
    return 'circle';
  }

  loadDirectoryData(): void {
    this.isLoading = true;
    this.directoryService
      .getCompanyDetails(`${ApiTag.DIRECTORY}-${this.name}`)
      .subscribe(
        (data: DirectoryDto[]) => {
          if (data.length > 0) {
            this.directory = data[0];
            if (this.directory.content && this.directory.content.rendered) {
              this.extractBusinessCards(this.directory.content.rendered);
            }
            if (
              this.directory._links &&
              this.directory._links['wp:featuredmedia']
            ) {
              const featuredMediaUrl =
                this.directory._links['wp:featuredmedia'][0].href;
              this.loadFeaturedImage(featuredMediaUrl);
            }
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al cargar los datos del directorio:', error);
          this.isLoading = false;
        }
      );
  }

  loadFeaturedImage(mediaUrl: string): void {
    this.getMediaResource
      .getMediaResource(mediaUrl)
      .subscribe((media: GetMediaResourceDto) => {
        this.featuredMedia = media;
      });
  }

  extractBusinessCards(content: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const businessCardElements = doc.querySelectorAll('.wp-block-business-card');

    this.businessCards = Array.from(businessCardElements).map(
      (element, index) => {
        const attributes = element.getAttribute('data-attributes');
        let cardData: any = {};
        if (attributes) {
          try {
            cardData = JSON.parse(attributes);
          } catch (error) {
            console.error('Error al parsear atributos:', error);
          }
        }
        const name = cardData.name || '';
        const title = cardData.title || '';
        const contacts = (cardData.contacts || []).map((contact: any, idx: number) => ({
          id: `contact-${idx}`,
          iconClass: contact.icon?.class || '',
          text: contact.text || '',
        }));

        return { id: `card-${index}`, name, title, contacts };
      }
    );
  }
}
