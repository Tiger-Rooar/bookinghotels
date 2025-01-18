import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '../../services/country/country.service';
import { CityService } from '../../services/city/city.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, TranslateModule, NgIf, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  name = '';
  lastname = '';
  birthdate: string | null = '';
  email = '';
  password = '';
  repeatPassword = '';
  selectedCountry: string | null = '';
  selectedCity: string | null = '';
  address = '';
  phone = '';
  selectedCountryPrefix = 'Select Country';
  showPassword = false;
  showRepeatPassword = false;

  countries: { id: string; name: string; prefix: string }[] = [];
  cities: { id: string; name: string }[] = [];
  loading = false;
  errorMessage = '';
  formErrors = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    repeatPassword: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    birthdate: '',
  };
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private countryService: CountryService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.countryService.getCountries().subscribe(
      (countryData) => {
        this.countries = countryData;
        this.loading = false;

        if (this.countries.length > 0) {
          this.selectedCountry = this.countries[0].id;
          this.selectedCountryPrefix = this.countries[0].prefix || '';
          this.fetchCitiesForCountry(this.selectedCountry);
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Error loading countries';
      }
    );
  }

  onCountryChange(): void {
    if (this.selectedCountry) {
      const selectedCountry = this.countries.find(
        (country) => country.id === this.selectedCountry
      );
      this.selectedCountryPrefix = selectedCountry ? selectedCountry.prefix : '';
      this.fetchCitiesForCountry(this.selectedCountry);
    } else {
      this.selectedCountryPrefix = 'Select Country';
    }
  }

  private fetchCitiesForCountry(countryId: string): void {
    this.cityService.getCities(countryId).subscribe(
      (data) => {
        this.cities = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load cities for the selected country';
      }
    );
  }

  validateField(field: keyof RegisterComponent['formErrors']): void {
    switch (field) {
      case 'name':
      case 'lastname':
      case 'address':
      case 'phone':
      case 'birthdate':
        this.formErrors[field] = !this[field] ? this.translateService.instant('REQUIRED FIELD') : '';
        break;

      case 'email':
        this.formErrors.email = !this.emailRegex.test(this.email)
          ? this.translateService.instant('PLEASE ENTER A VALID EMAIL ADDRESS EXAMPLE')
          : '';
        break;

      case 'password':
        this.formErrors.password = !this.passwordRegex.test(this.password)
          ? this.translateService.instant('PASSWORD MUST BE AT LEAST 8 CHARACTERS LONG AND INCLUDE AT LEAST ONE UPPERCASE LETTER, ONE NUMBER, AND ONE SPECIAL CHARACTER')
          : '';
        this.validatePasswordMatch();
        break;

      case 'repeatPassword':
        this.validatePasswordMatch();
        break;

      default:
        break;
    }
  }

  validatePasswordMatch(): void {
    this.formErrors.repeatPassword = this.password !== this.repeatPassword
      ? this.translateService.instant('PASSWORDS DO NOT MATCH')
      : '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPasswordVisibility() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  validateForm(): boolean {
    let isValid = true;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        const key = field as keyof RegisterComponent['formErrors'];
        if (this.formErrors[key]) {
          isValid = false;
        }
      }
    }
    return isValid;
  }

  formatPhoneNumber(): void {
    let phoneNumber = this.phone.replace(/\D/g, '');

    if (phoneNumber.length <= 3) {
      phoneNumber = phoneNumber.replace(/(\d{1,3})/, '$1');
    } else if (phoneNumber.length <= 6) {
      phoneNumber = phoneNumber.replace(/(\d{1,3})(\d{1,3})/, '$1-$2');
    } else if (phoneNumber.length <= 9) {
      phoneNumber = phoneNumber.replace(/(\d{1,3})(\d{1,3})(\d{1,3})/, '$1-$2-$3');
    } else {
      phoneNumber = phoneNumber.replace(/(\d{1,3})(\d{1,3})(\d{1,3})(\d{1,3})/, '$1-$2-$3-$4');
    }

    this.phone = phoneNumber;
  }

  register(): void {
    this.resetFormErrors();

    this.checkRequiredFields();

    if (!this.validateForm()) {
      return;
    }

    const user = {
      name: this.name,
      lastname: this.lastname,
      birthdate: this.birthdate,
      email: this.email,
      password: this.password,
      country: this.selectedCountry,
      city: this.selectedCity,
      address: this.address,
      phone: this.selectedCountryPrefix + this.phone,
    };

    localStorage.setItem('user', JSON.stringify(user));
    this.resetForm();
    this.router.navigate(['/login']);
  }

  resetFormErrors(): void {
    this.formErrors = {
      name: '',
      lastname: '',
      email: '',
      password: '',
      repeatPassword: '',
      country: '',
      city: '',
      address: '',
      phone: '',
      birthdate: '',
    };
  }

  checkRequiredFields(): void {
    if (!this.name) this.formErrors.name = this.translateService.instant('REQUIRED FIELD');
    if (!this.lastname) this.formErrors.lastname = this.translateService.instant('REQUIRED FIELD');
    if (!this.email) this.formErrors.email = this.translateService.instant('REQUIRED FIELD');
    if (!this.selectedCountry) this.formErrors.country = this.translateService.instant('REQUIRED FIELD');
    if (!this.selectedCity) this.formErrors.city = this.translateService.instant('REQUIRED FIELD');
    if (!this.address) this.formErrors.address = this.translateService.instant('REQUIRED FIELD');
    if (!this.phone) this.formErrors.phone = this.translateService.instant('REQUIRED FIELD');
    if (!this.birthdate) this.formErrors.birthdate = this.translateService.instant('REQUIRED FIELD');
  }

  resetForm(): void {
    this.name = '';
    this.lastname = '';
    this.birthdate = '';
    this.email = '';
    this.password = '';
    this.repeatPassword = '';
    this.selectedCountry = '';
    this.selectedCity = '';
    this.address = '';
    this.phone = '';
  }
}
