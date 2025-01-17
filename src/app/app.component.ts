import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from './services/loading/loading.service';
import { NgIf, CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NgIf,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ProjectByKhutso';
  isLoading = false;
  showScrollUpButton = false;

  constructor(
    private translate: TranslateService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeTranslation();
  }

  ngOnInit(): void {
    this.setupLoadingIndicator();
  }

  private initializeTranslation(): void {
    const defaultLang = 'ge';
    const supportedLangs = ['ge', 'en'];

    this.translate.addLangs(supportedLangs);
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);
  }

  private setupLoadingIndicator(): void {
    this.loadingService.showLoading();

    this.loadingService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
      this.cdr.detectChanges();
    });

    setTimeout(() => {
      this.loadingService.hideLoading();
    }, 2000);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.showScrollUpButton = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
