import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-float-input',
  templateUrl: './float-input.component.html',
  styleUrl: './float-input.component.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class FloatInputComponent {
  @Input() type: string = 'text';
  @Input() title!: string;
  @Input() control!: FormControl | any;
  @Input() requiredText!: string;
  @Input() hint!: string;
  @Input() options: { value: string; label: string }[] = [];
  @Input() radioName!: string;
}
