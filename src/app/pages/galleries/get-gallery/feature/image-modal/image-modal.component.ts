
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconComponent } from '../../../../../ui';

@Component({
    selector: 'app-image-modal',
    imports: [IconComponent],
    templateUrl: './image-modal.component.html',
    styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  @Input() imageUrl!: string;
  @Input() imageTitle!: string;

  constructor(public activeModal: NgbActiveModal) {}

  closeModal(): void {
    this.activeModal.dismiss();
  }
}
