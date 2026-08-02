import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FloatInputComponent } from '../../../../../shared/components/float-input/float-input.component';
import { IconComponent } from '../../../../../ui';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../../../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, filter, tap } from 'rxjs';
import { SnackBarService } from '../../../../../services/commons/snack-bar/snack-bar.service';
import { SnackBarsColors } from '../../../../../services/commons/snack-bar/enums';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-contact-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IconComponent,
        FloatInputComponent,
        MatSnackBarModule,
    ],
    templateUrl: './contact-form.component.html',
    styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  contactForm!: FormGroup;
  responseData: any;
  submissionStatus: string = '';
  readonly #snackBarService = inject(SnackBarService);
  readonly #formsService = inject(FormsService);

  formId = 31;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombres: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      celular: [
        '+569',
        [Validators.required, Validators.pattern(/^\+569\d{8}$/)],
      ],
      mensaje: ['', Validators.required],
    });

    this.#formsService.success$
      .pipe(
        takeUntilDestroyed(),
        tap(() =>
          this.#snackBarService.show({
            body: 'Formulario enviado con éxito',
            color: SnackBarsColors.SUCCESS,
            delay: 5000,
          })
        )
      )
      .subscribe();

    this.#formsService.isLoading$
      .pipe(
        takeUntilDestroyed(),
        filter(Boolean),
        tap(() =>
          this.#snackBarService.show({
            body: 'Enviando formulario...',
            color: SnackBarsColors.PRIMARY,
            delay: 3000,
          })
        )
      )
      .subscribe();

    this.#formsService.hasError$
      .pipe(
        takeUntilDestroyed(),
        filter(Boolean),
        tap(() =>
          this.#snackBarService.show({
            body: 'Ha ocurrido un error. Por favor, vuelve a intentarlo.',
            color: SnackBarsColors.DANGER,
            delay: 5000,
          })
        )
      )
      .subscribe();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append(
        'your-name',
        this.contactForm.get('nombres')?.value || ''
      );
      formData.append('your-email', this.contactForm.get('email')?.value || '');

      formData.append(
        'your-subject',
        this.contactForm.get('asunto')?.value || ''
      );

      formData.append(
        'your-cellphone',
        this.contactForm.get('celular')?.value || ''
      );

      formData.append(
        'your-message',
        this.contactForm.get('mensaje')?.value || ''
      );

      formData.append('_wpcf7_unit_tag', '0c6b143');

      this.#formsService
        .submitForm(this.formId, formData)
        .pipe(
          tap(() => {
            this.contactForm.reset();
            this.contactForm.get('celular')?.setValue('+569');
          }),
          catchError((error) => {
            console.error('Error submitting form', error);
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      console.warn('Form is invalid');
    }
  }

  enforcePrefix() {
    const celularControl = this.contactForm.get('celular');
    celularControl?.valueChanges.subscribe((value) => {
      if (!value.startsWith('+569')) {
        celularControl.setValue('+569' + value.replace(/^\+569/, ''), {
          emitEvent: false,
        });
      }
    });
  }

  preventPrefixDeletion(event: KeyboardEvent) {
    const control = this.contactForm.get('celular');
    const cursorPosition = (event.target as HTMLInputElement).selectionStart;
    if (cursorPosition !== null && cursorPosition <= 4) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
      }
    }
  }
}
