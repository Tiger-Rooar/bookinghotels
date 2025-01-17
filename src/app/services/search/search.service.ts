import { Injectable } from '@angular/core';
import { HotelsService } from '../hotels/hotels.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private hotels: any[] = [];

  constructor(private hotelsService: HotelsService) {
    this.hotelsService.getHotels().subscribe((hotels) => {
      this.hotels = hotels;
    });
  }

  searchHotels(searchTerm: string): Observable<any[]> {
    if (!searchTerm.trim()) {
      return of([]);
    }

    const filteredHotels = this.hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filteredHotels);
  }
}
