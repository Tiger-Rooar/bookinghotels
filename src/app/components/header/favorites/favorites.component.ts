import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from '../../../services/favorites/favorites.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Favorite } from '../../../services/favorites/favorite.model';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [NgFor, RouterModule, NgIf, TranslateModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  favorites: Favorite[] = [];
  favoritesSubscription: Subscription | null = null;
  favoriteStatus: { [key: number]: boolean } = {};

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
      this.updateFavoriteStatus();
    });
  }

  ngOnDestroy() {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  goToHotel(favorite: Favorite) {
    this.closeDropdown();
    this.router.navigate(['/hotel', favorite.id]);
  }

  removeFavorite(favorite: Favorite) {
    this.favoritesService.removeFavorite(favorite.id);
  }

  updateFavoriteStatus() {
    this.favorites.forEach(fav => {
      this.favoriteStatus[fav.id] = true;
    });
  }

  toggleFavorite(hotel: Favorite) {
    if (this.favoriteStatus[hotel.id]) {
      this.favoritesService.removeFavorite(hotel.id);
    } else {
      this.favoritesService.addFavorite(hotel);
    }
    this.favoriteStatus[hotel.id] = !this.favoriteStatus[hotel.id];
  }

  get isFavoritesEmpty(): boolean {
    return this.favorites.length === 0;
  }
}
