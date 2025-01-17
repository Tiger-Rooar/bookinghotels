import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule, NgIf, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = false;
  errorMessage = '';
  isEmailValid = true;
  isPasswordValid = true;
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.validateFields();

    if (!this.isEmailValid || !this.isPasswordValid) {
      this.loginError = true;
      this.errorMessage = 'Invalid email or password format';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          const redirectUrl = this.authService.redirectUrl || '/dashboard';
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.onLoginFailure();
        }
      },
      (error) => {
        this.onLoginFailure(error);
      }
    );
  }

  private validateFields() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email.trim());
    this.isPasswordValid = this.password.trim().length >= 8;
  }

  private onLoginFailure(error?: any) {
    this.loginError = true;
    this.errorMessage = error ? 'Login failed. Please try again.' : 'Invalid email or password.';
  }
}
