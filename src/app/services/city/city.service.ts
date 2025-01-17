import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private cities = {
    '1': [{ id: '1', name: 'თბილისი' }, { id: '2', name: 'მცხეთა' }],
    '2': [{ id: '3', name: 'Toronto' }, { id: '4', name: 'Vancouver' }],
    '3': [{ id: '5', name: 'Delhi' }, { id: '6', name: 'Mumbai' }],
  };

  getCities(countryId: string): Observable<any[]> {
    return of(this.cities[countryId as keyof typeof this.cities] || []);
  }
}
