import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'isAuthenticated';
  private readonly USER_KEY = 'user';
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeLoginState();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    if (this.isBrowser()) {
      const storedUser = JSON.parse(localStorage.getItem(this.USER_KEY) || '{}');

      if (storedUser.email === email && storedUser.password === password) {
        localStorage.setItem(this.AUTH_KEY, 'true');
        this.loggedInSubject.next(true);
        return of(true);
      }
    }

    return of(false);
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.AUTH_KEY);
      this.loggedInSubject.next(false);
    }
  }

  isAuthenticated(): boolean {
    return this.isBrowser() && localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  private initializeLoginState(): void {
    const isAuthenticated = this.isAuthenticated();
    this.loggedInSubject.next(isAuthenticated);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
