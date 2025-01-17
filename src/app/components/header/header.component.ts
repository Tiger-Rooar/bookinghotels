import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationComponent, FavoritesComponent, TranslateModule, NgIf, RouterModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ge';
  isLoggedIn: boolean = false;
  private loginStatusSubscription: Subscription | null = null;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.addFontAwesome();

    if (this.isBrowser()) {
      const savedLang = localStorage.getItem('language') || 'ge';
      this.currentLanguage = savedLang;
      this.translate.use(savedLang);
    }

    this.loginStatusSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  useLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translate.use(lang);

    if (this.isBrowser()) {
      localStorage.setItem('language', lang);
    }
  }

  logOut(): void {
    this.authService.logout();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private addFontAwesome(): void {
    if (this.isBrowser()) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(link);
    }
  }

  ngOnDestroy(): void {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }
}
