import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking/booking.service';
import { HotelsService } from '../../services/hotels/hotels.service';
import { Hotel, Room } from '../../services/hotels/hotels';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, TranslateModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  hotels: Hotel[] = [];
  rooms: Room[] = [];
  selectedHotel: Hotel | null = null;
  selectedRoom: Room | null = null;
  bookings: any[] = [];
  
  constructor(
    private hotelsService: HotelsService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadHotelsAndRooms();

    this.bookings = this.bookingService.getBookings() || [];
    console.log('Current Bookings:', this.bookings);
  }

  loadHotelsAndRooms(): void {
    this.hotelsService.getHotels().subscribe((hotels) => {
      this.hotelsService.getRooms().subscribe((rooms) => {
        console.log('Rooms API Response:', rooms);
  
        this.hotels = hotels.map((hotel) => ({
          ...hotel,
          rooms: rooms
            .filter((room) => room.hotelId === hotel.id)
            .map((room) => ({
              ...room,
              roomName: room.name || `Room #${room.roomId}`,
              imageUrl: room.imageUrl?.trim() || '/assets/no-image.jpg',
            })),
        }));
        console.log('Mapped Hotels:', this.hotels);
  
        this.hotels.forEach((hotel) => {
          hotel.rooms.forEach((room) => {
            console.log('Room Name:', room.roomName);
            if (!room.roomName) {
              console.error('Room Name is undefined:', room);
            }
          });
        });
      });
    });
  }

  onHotelChange(): void {
    this.selectedRoom = null;
    if (this.selectedHotel) {
      this.rooms = this.selectedHotel.rooms || [];
    }
  }

  getRoomName(room: Room): string {
    const name = room.roomName || `Room #${room.roomId}`;
    console.log('Room Name:', name);
    return name;
  }
  

  bookRoom(): void {
    console.log('Selected Room:', this.selectedRoom);
    if (this.selectedRoom && this.selectedHotel) {
      const newBooking = {
        bookingId: new Date().getTime(),
        hotelName: this.selectedHotel.name,
        roomName: this.selectedRoom.roomName,
        roomImage: this.selectedRoom.imageUrl || '/assets/no-image.jpg',
        pricePerNight: this.selectedRoom.pricePerNight,
        checkInDate: new Date().toISOString(),
        maximumGuests: this.selectedRoom.maximumGuests,
      };
      this.bookingService.addBooking(newBooking);
      this.bookings = this.bookingService.getBookings() || [];
      console.log('Updated Bookings:', this.bookings);
    }
  }
  

  removeBooking(bookingId: number): void {
    this.bookingService.removeBooking(bookingId);
    this.bookings = this.bookingService.getBookings() || [];
    console.log('Updated Bookings:', this.bookings);
  }
}
