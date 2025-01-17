import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CountryService } from '../../../services/country/country.service';
import { CityService } from '../../../services/city/city.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  // User profile variables
  user: any = {};
  countries: any[] = [];
  cities: any[] = [];
  isEditing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isRedirecting: boolean = false;
  phone: string = '';
  selectedCountryPrefix: string = '+';
  selectedCountry: string = '';
  loading: boolean = false;
  countryName: string = '';
  cityName: string = '';

  isChangingPassword: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';

  constructor(
    private countryService: CountryService,
    private cityService: CityService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    const storedCountry = localStorage.getItem('selectedCountry');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.user = {
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        address: '',
        country: storedCountry || '',
        city: '',
        password: 'defaultPassword',
      };
    }

    this.loading = true;
    this.countryService.getCountries().subscribe(
      (countryData) => {
        this.countries = countryData;
        this.loading = false;
        if (this.countries.length > 0) {
          this.selectedCountry = this.user.country || this.countries[0].id;
          this.selectedCountryPrefix =
            this.countries.find((country) => country.id === this.selectedCountry)
              ?.prefix || '';
          this.fetchCitiesForCountry(this.selectedCountry);
        }
      },
      () => {
        this.loading = false;
        this.errorMessage = 'Error loading countries';
      }
    );

    this.loadCountryName();
    this.loadCityName();
  }

  loadCountryName(): void {
    if (this.user.country) {
      this.countryService.getCountries().subscribe((countries) => {
        const country = countries.find((c: any) => c.id === this.user.country);
        this.countryName = country?.name || 'Unknown';
      });
    }
  }

  loadCityName(): void {
    if (this.user.city) {
      this.cityService.getCities(this.user.country).subscribe((cities) => {
        const city = cities.find((c: any) => c.id === this.user.city);
        this.cityName = city?.name || 'Unknown';
      });
    }
  }

  private fetchCitiesForCountry(countryId: string): void {
    this.cityService.getCities(countryId).subscribe(
      (data) => {
        this.cities = data;
      },
      () => {
        this.errorMessage = 'Failed to load cities for the selected country';
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
      this.selectedCountryPrefix = this.translate.instant('SELECT COUNTRY');
    }
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

  editProfile(): void {
    this.isEditing = true;
  }

  async saveChanges(): Promise<void> {
    if (this.user) {
      this.user.phone = this.selectedCountryPrefix + this.phone.replace(/\D/g, '');
      localStorage.setItem('user', JSON.stringify(this.user));
      this.isEditing = false;

      await Swal.fire({
        icon: 'success',
        title: this.translate.instant('PROFILE UPDATED'),
        showConfirmButton: false,
        timer: 3000,
      });

      this.router.navigate(['/dashboard/user-profile']);
    } else {
      this.errorMessage = 'No user data to save!';
    }
  }

  cancelEdit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    this.isEditing = false;
  }

  showChangePassword(): void {
    this.isChangingPassword = true;
  }

  async saveNewPassword(): Promise<void> {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!this.newPassword.match(passwordPattern)) {
      this.passwordError = this.translate.instant('PASSWORD MUST BE AT LEAST 8 CHARACTERS LONG AND INCLUDE AT LEAST ONE UPPERCASE LETTER, ONE NUMBER, AND ONE SPECIAL CHARACTER');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = this.translate.instant('PASSWORDS DO NOT MATCH');
      return;
    }

    if (this.currentPassword !== this.user.password) {
      this.passwordError = this.translate.instant('CURRENT PASSWORD INCORRECT');
      return;
    }

    this.user.password = this.newPassword;
    localStorage.setItem('user', JSON.stringify(this.user));
    this.isChangingPassword = false;

    await Swal.fire({
      icon: 'success',
      title: this.translate.instant('PASSWORD UPDATED'),
      showConfirmButton: false,
      timer: 3000,
    });
  }

  cancelPasswordChange(): void {
    this.isChangingPassword = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
  }
}
