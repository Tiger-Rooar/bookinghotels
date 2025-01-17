import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotelsService } from '../../../services/hotels/hotels.service';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesService } from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [NgIf, NgFor, RouterModule, TranslateModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  searchTerm: string = '';
  results: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private hotelsService: HotelsService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.getSearchResults();
    });
  }

  getSearchResults() {
    if (this.searchTerm) {
      this.hotelsService.getHotels().subscribe((hotels) => {
        this.results = hotels.filter((hotel) =>
          hotel.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          hotel.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          hotel.address.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    }
  }

  toggleFavorite(hotel: any): void {
    if (this.favoritesService.isFavorite(hotel.id)) {
      this.favoritesService.removeFavorite(hotel.id);
    } else {
      this.favoritesService.addFavorite(hotel);
    }
  }

  isFavorite(hotel: any): boolean {
    return this.favoritesService.isFavorite(hotel.id);
  }
}
