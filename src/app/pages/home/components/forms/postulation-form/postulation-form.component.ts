import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../../../../services';
import { CommonModule } from '@angular/common';
import { EMPTY, catchError, map, of, tap } from 'rxjs';
import { SnackBarService } from '../../../../../services/commons/snack-bar/snack-bar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SnackBarsColors } from '../../../../../services/commons/snack-bar/enums';
import { IconComponent } from '../../../../../ui';

@Component({
  selector: 'app-postulation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './postulation-form.component.html',
  styleUrl: './postulation-form.component.css',
})
export class PostulationFormComponent {
  infoForm: FormGroup;
  responseData: any;
  submissionStatus: string = '';
  readonly #snackBarService = inject(SnackBarService);
  readonly #formsService = inject(FormsService);

  formId = 30;

  constructor(private fb: FormBuilder) {
    this.infoForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.#formsService.success$.pipe(
      takeUntilDestroyed(),
      tap(() =>
        this.#snackBarService.show({
          body: 'Formulario enviado con éxito',
          color: SnackBarsColors.SUCCESS,
          delay: 5000,
        })
      )
    );

    this.#formsService.isLoading$.pipe(
      takeUntilDestroyed(),
      tap(() =>
        this.#snackBarService.show({
          body: 'Enviando formulario...',
          color: SnackBarsColors.PRIMARY,
          delay: 3000,
        })
      )
    );

    this.#formsService.hasError$.pipe(
      takeUntilDestroyed(),
      tap(() =>
        this.#snackBarService.show({
          body: 'Ha ocurrido un error. Por favor, vuelve a intentarlo.',
          color: SnackBarsColors.DANGER,
          delay: 5000,
        })
      )
    );
  }

  onSubmit() {
    if (this.infoForm.valid) {
      const formData = new FormData();
      formData.append('your-name', this.infoForm.get('name')?.value || '');
      formData.append('your-email', this.infoForm.get('email')?.value || '');

      formData.append('_wpcf7_unit_tag', '0c6b143');

      this.#formsService
        .submitForm(this.formId, formData)
        .pipe(
          tap(() => {
            this.infoForm.reset();
          }),
          catchError((error) => {
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      console.warn('Form is invalid');
    }
  }
}
