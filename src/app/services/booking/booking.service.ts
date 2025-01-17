import { Injectable } from '@angular/core';

export interface Booking {
  bookingId: number;
  hotelName: string;
  roomName: string;
  pricePerNight: number;
  checkInDate: string;
  maximumGuests: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private localStorageKey = 'hotelBookings';

  constructor() {}

  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving bookings from localStorage:', error);
      return [];
    }
  }

  addBooking(booking: Booking): void {
    try {
      const bookings = this.getBookings();

      if (!bookings.find(b => b.bookingId === booking.bookingId)) {
        bookings.push(booking);
        localStorage.setItem(this.localStorageKey, JSON.stringify(bookings));
      } else {
        console.warn('Booking with this ID already exists:', booking.bookingId);
      }
    } catch (error) {
      console.error('Error adding booking to localStorage:', error);
    }
  }

  removeBooking(bookingId: number): void {
    try {
      let bookings = this.getBookings();
      bookings = bookings.filter(booking => booking.bookingId !== bookingId);
      localStorage.setItem(this.localStorageKey, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error removing booking from localStorage:', error);
    }
  }

  updateBooking(updatedBooking: Booking): void {
    try {
      const bookings = this.getBookings();
      const index = bookings.findIndex(b => b.bookingId === updatedBooking.bookingId);

      if (index !== -1) {
        bookings[index] = updatedBooking;
        localStorage.setItem(this.localStorageKey, JSON.stringify(bookings));
      } else {
        console.warn('Booking with this ID not found:', updatedBooking.bookingId);
      }
    } catch (error) {
      console.error('Error updating booking in localStorage:', error);
    }
  }
}