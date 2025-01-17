import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchTerm) {
      this.router.navigate(['/search-results'], {
        queryParams: { search: this.searchTerm },
      });
    }
  }
}
