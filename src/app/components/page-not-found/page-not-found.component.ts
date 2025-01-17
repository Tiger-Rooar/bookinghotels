import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  imports: [TranslateModule],
  template: `<h1>404 - {{ 'PAGE NOT FOUND' | translate }}</h1>`,
  styleUrls: ['./page-not-found.component.css'],
  standalone: true
})
export class PageNotFoundComponent {}
