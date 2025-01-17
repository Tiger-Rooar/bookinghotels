import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  formSubmitted: boolean = false;
  formErrors: { [key: string]: string } = {};

  constructor(private translate: TranslateService) {
    this.contactForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z\u0000-\uFFFF ]*$')]),
      lastName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z\u0000-\uFFFF ]*$')]),
      citizensId: new FormControl('', [Validators.required, Validators.pattern('^\\d{11}$')]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^\\+995 \\d{3} \\d{3} \\d{3}$')]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]), 
      subject: new FormControl('', [Validators.required]),
      additionalInfo: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.contactForm.controls['email'].valueChanges.subscribe(() => {
      this.validateField('email');
    });

    this.contactForm.controls['subject'].valueChanges.subscribe(() => {
      this.validateField('subject');
    });

    this.contactForm.controls['firstName'].valueChanges.subscribe(() => {
      this.validateField('firstName');
    });
    this.contactForm.controls['lastName'].valueChanges.subscribe(() => {
      this.validateField('lastName');
    });
    this.contactForm.controls['phone'].valueChanges.subscribe(() => {
      this.validateField('phone');
    });
    this.contactForm.controls['citizensId'].valueChanges.subscribe(() => {
      this.validateField('citizensId');
    });
    this.contactForm.controls['additionalInfo'].valueChanges.subscribe(() => {
      this.validateField('additionalInfo');
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.contactForm.controls;
  }

  validateField(field: string): void {
    const control = this.contactForm.get(field);
    if (control) {
      if (control.invalid && (control.touched || this.formSubmitted)) {
        if (control.errors?.['required']) {
          this.formErrors[field] = this.translate.instant('REQUIRED FIELD');
        } else if (control.errors?.['pattern']) {
          if (field === 'citizensId') {
            this.formErrors[field] = this.translate.instant('CITIZEN_ID_MUST_BE_11_DIGITS');
          } else if (field === 'phone') {
            this.formErrors[field] = this.translate.instant('PHONE_MUST_BE_VALID');
          } else if (field === 'email') {
            this.formErrors[field] = this.translate.instant('PLEASE_ENTER_A_VALID_EMAIL_ADDRESS_EXAMPLE');
          } else {
            this.formErrors[field] = this.translate.instant('INVALID CHARACTERS');
          }
        } else if (control.errors?.['email']) {
          this.formErrors[field] = this.translate.instant('PLEASE_ENTER_A_VALID_EMAIL_ADDRESS_EXAMPLE');
        }
      } else {
        this.formErrors[field] = '';
      }
    }
  }
  

  validateForm(): void {
    for (const field in this.f) {
      this.validateField(field);
    }
  }

  isInvalid(controlName: string): boolean {
    return this.f[controlName].invalid && (this.f[controlName].touched || this.formSubmitted);
  }

  get isSubmitDisabled(): boolean {
    return !this.contactForm.valid;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.validateForm();

    if (this.contactForm.valid) {
      console.log('Form Submitted', this.contactForm.value);
      this.formSubmitted = true;
      setTimeout(() => {
        this.formSubmitted = true;
      }, 3000);
    } else {
      console.log('Form is invalid');
    }
  }

  onPhoneInput(event: any): void {
    let input = event.target.value;
    input = input.replace(/\D/g, '');

    if (!input.startsWith('995')) {
      input = '995' + input;
    }

    if (input.length > 9) {
      input = '+995 ' + input.slice(3, 6) + ' ' + input.slice(6, 9) + ' ' + input.slice(9, 12);
    } else if (input.length > 6) {
      input = '+995 ' + input.slice(3, 6) + ' ' + input.slice(6, 9);
    } else if (input.length > 3) {
      input = '+995 ' + input.slice(3, 6);
    } else {
      input = '+995 ';
    }

    const control = this.contactForm.get('phone');
    if (control) {
      if (control.value !== input) {
        control.setValue(input, { emitEvent: false });
      }
    }

    event.target.value = input;
  }
}
