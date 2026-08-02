import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewMachines } from '../../../../shared/interfaces/viewMachines';
import { CompanieService } from '../../../../services/companies';
import { LinksStaffComponent } from '../../../../shared/components/links-staff/links-staff.component';
import { LinksHomeComponent } from '../../../../shared/components/links-home/links-home.component';
import { IconComponent } from '../../../../ui';
import { ApiTag } from '../../../../services/environments/api-tag/api-tag.enum';
import {
  ImageMachine,
  MachinesDto,
} from '../../../../shared/interfaces/machines.dto';

@Component({
  standalone: true,
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css'],
  imports: [LinksStaffComponent, LinksHomeComponent, IconComponent],
})
export class MachinesComponent implements OnInit {
  items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  name!: string;
  machine: any = {};
  images: ImageMachine[] = [];

  constructor(
    private route: ActivatedRoute,
    private machinesService: CompanieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.name = params['nombre-company'];
      this.loadMachineData();
    });
  }

  loadMachineData(): void {
    this.machinesService
      .getCompanyDetails(`${ApiTag.MACHINES}-${this.name}`)
      .subscribe(
        (data: MachinesDto[]) => {
          if (data.length > 0) {
            this.machine = data[0];
            if (this.machine.content && this.machine.content.rendered) {
              this.images = this.extractGalleryImages(
                this.machine.content.rendered
              ); // Llamada actualizada
            } else {
              console.warn(
                'La propiedad "rendered" no está disponible en los datos de la máquina.'
              );
            }
          }
        },
        (error) => {
          console.error('Error al cargar los datos de la máquina:', error);
        }
      );
  }

  extractGalleryImages(content: string): ImageMachine[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const imageElements = doc.querySelectorAll('.wp-block-gallery img');
    const images: ImageMachine[] = [];

    imageElements.forEach((imgElement) => {
      const id = parseInt(imgElement.getAttribute('data-id') || '0', 10);
      const src = imgElement.getAttribute('src') || '';
      const alt = imgElement.getAttribute('alt') || ''; // Texto alternativo
      const caption = imgElement.nextElementSibling?.textContent?.trim() || '';
      const width = parseInt(imgElement.getAttribute('width') || '0', 10);
      const height = parseInt(imgElement.getAttribute('height') || '0', 10);
      const title = imgElement.getAttribute('title') || ''; // Título

      images.push({ id, src, alt, caption, width, height, title });
    });

    return images;
  }
}
