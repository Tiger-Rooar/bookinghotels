import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Hotel } from './hotels';

@Injectable({
  providedIn: 'root',
})
export class HotelsService {
  private hotelsUrl = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';
  private roomsUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetAll';
  
  private roomDetailsUrl = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/';

  constructor(private http: HttpClient) {}

  getHotels(hotelId?: number): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.hotelsUrl);
  }

  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.roomsUrl).pipe(
      catchError((error) => {
        console.error('Error fetching rooms:', error);
        return throwError(() => new Error('Failed to fetch rooms.'));
      })
    );
  }

  getRoomDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.roomDetailsUrl}${id}`);
  }
}