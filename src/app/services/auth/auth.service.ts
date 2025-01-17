import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'isAuthenticated';
  private readonly USER_KEY = 'user';
  private readonly API_URL = 'https://676fbffbb353db80c323756d.mockapi.io/api/users/users';

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  redirectUrl: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeLoginState();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    if (this.isBrowser()) {
      const storedUser = JSON.parse(localStorage.getItem(this.USER_KEY) || '{}');
      if (storedUser && storedUser.email === email && storedUser.password === password) {
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

  register(user: any): Observable<any> {
    return this.http.post<any>(this.API_URL, user).pipe(
      catchError((error) => {
        console.error('Registration failed', error);
        throw error;
      })
    );
  }

  private initializeLoginState(): void {
    const storedUser = this.isBrowser() ? JSON.parse(localStorage.getItem(this.USER_KEY) || '{}') : null;
    const isAuthenticated = storedUser && localStorage.getItem(this.AUTH_KEY) === 'true';
    this.loggedInSubject.next(isAuthenticated);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
