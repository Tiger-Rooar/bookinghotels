import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Favorite } from './favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
private favoritesSubject = new BehaviorSubject<Favorite[]>(this.getFavorites());
favorites$ = this.favoritesSubject.asObservable();

constructor() {}

private isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}

private getFavorites(): Favorite[] {
  if (this.isLocalStorageAvailable()) {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }
  return [];
}

private saveFavorites(favorites: Favorite[]): void {
  if (this.isLocalStorageAvailable()) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

addFavorite(hotel: Favorite): void {
  const favorites = this.getFavorites();
  if (!this.isFavorite(hotel.id)) {
    favorites.push(hotel);
    this.saveFavorites(favorites);
    this.favoritesSubject.next(favorites);
  }
}

removeFavorite(id: number): void {
  const favorites = this.getFavorites();
  const updatedFavorites = favorites.filter(favorite => favorite.id !== id);
  this.saveFavorites(updatedFavorites);
  this.favoritesSubject.next(updatedFavorites);
}

isFavorite(hotelId: number): boolean {
  const favorites = this.getFavorites();
  return favorites.some(fav => fav.id === hotelId);
}

clearFavorites(): void {
  if (this.isLocalStorageAvailable()) {
    localStorage.removeItem('favorites');
    this.favoritesSubject.next([]);
  }
}
}
