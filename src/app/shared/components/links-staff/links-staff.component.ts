import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-links-staff',
    templateUrl: './links-staff.component.html',
    styleUrls: ['./links-staff.component.css'],
    imports: [RouterLink]
})
export class LinksStaffComponent {
  // input component
  @Input() name!: string;
}
