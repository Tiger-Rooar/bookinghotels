import { Component, inject, OnInit } from '@angular/core';
import { Hotel } from '../../services/hotels/hotels';
import { HotelsService } from '../../services/hotels/hotels.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [NgFor, RouterModule, TranslateModule, HttpClientModule, NgIf],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css'],
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  selectedImage: string | null = null;
  menuOpen: boolean = false;
  hotelsListService: HotelsService = inject(HotelsService);

  constructor(private translate: TranslateService, private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelsListService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('hotels', JSON.stringify(this.hotels));
        }
      },
      error: (err) => console.error('Error loading hotels:', err),
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
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