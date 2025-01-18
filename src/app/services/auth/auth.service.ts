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
      const storedUser = this.safeGetItem(this.USER_KEY);

      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          this.safeSetItem(this.AUTH_KEY, 'true');
          this.loggedInSubject.next(true);
          return of(true);
        }
      }
    }

    return of(false);
  }

  logout(): void {
    if (this.isBrowser()) {
      this.safeRemoveItem(this.AUTH_KEY);
      this.loggedInSubject.next(false);
    }
  }

  isAuthenticated(): boolean {
    return this.isBrowser() && this.safeGetItem(this.AUTH_KEY) === 'true';
  }

  private initializeLoginState(): void {
    const isAuthenticated = this.isAuthenticated();
    this.loggedInSubject.next(isAuthenticated);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing local storage:', error);
      return null;
    }
  }

  private safeSetItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting local storage:', error);
    }
  }

  private safeRemoveItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing local storage item:', error);
    }
  }
}
