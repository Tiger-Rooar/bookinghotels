import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotelsService } from '../../services/hotels/hotels.service';
import { Hotel, Room, RoomService } from '../../services/hotels/hotels';
import { Title } from '@angular/platform-browser';
import { NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { LoadingService } from '../../services/loading/loading.service';
import { ChangeDetectorRef } from '@angular/core';
import { ROOM_SERVICES } from '../../services/rooms/rooms-service';

@Component({
  selector: 'app-hoteldetails',
  standalone: true,
  imports: [NgFor, NgIf, TranslateModule, HttpClientModule, RouterModule],
  templateUrl: './hoteldetails.component.html',
  styleUrls: ['./hoteldetails.component.css'],
})
export class HotelDetailsComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  hotel: Hotel | null = null;
  rooms: any[] = [];
  selectedImage: string | null = null;
  currentSlide: number = 0;
  imagesPerSlide: number = 4;
  isLoading = false;
  isRoomsLoading = true;
  openRoomId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private hotelsService: HotelsService,
    private titleService: Title,
    private translate: TranslateService,
    private favoritesService: FavoritesService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.showLoading();

    this.loadingService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });

    setTimeout(() => {
      this.loadingService.hideLoading();
    }, 2000);

    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.fetchHotelDetails(+hotelId);
      this.fetchHotelRooms(+hotelId);
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.fetchHotelDetailsFromStorage();
    }
  }

  fetchHotelDetailsFromStorage(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.fetchHotelDetails(+hotelId);
      this.fetchHotelRooms(+hotelId);
    }
  }

  fetchHotelDetails(id: number): void {
    if (typeof window !== 'undefined' && localStorage) {
      const storedHotel = localStorage.getItem(`hotel_${id}`);
      if (storedHotel) {
        this.hotel = JSON.parse(storedHotel);
        if (this.hotel) {
          this.titleService.setTitle(this.hotel.name);
        }
      } else {
        this.hotelsService.getHotels().subscribe({
          next: (hotels) => {
            this.hotel = hotels.find((hotel) => hotel.id === id) || null;
            if (this.hotel) {
              this.titleService.setTitle(this.hotel.name);
              localStorage.setItem(`hotel_${id}`, JSON.stringify(this.hotel));
            } else {
              this.titleService.setTitle('Hotel Details');
            }
          },
          error: (err) => {
            console.error('Error loading hotel details:', err);
            this.titleService.setTitle('Hotel Details');
          },
        });
      }
    }
  }

  fetchHotelRooms(hotelId: number): void {
    if (typeof window !== 'undefined' && localStorage) {
      const storedRooms = localStorage.getItem(`rooms_${hotelId}`);
      if (storedRooms) {
        this.rooms = JSON.parse(storedRooms);
        this.isRoomsLoading = false;
        this.cdr.detectChanges();
      } else {
        this.hotelsService.getRooms().subscribe({
          next: (rooms) => {
            this.rooms = rooms.filter((room) => room.hotelId === hotelId);
            if (this.rooms.length > 0) {
              localStorage.setItem(`rooms_${hotelId}`, JSON.stringify(this.rooms));
            }
            this.isRoomsLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading rooms:', err);
            this.isRoomsLoading = false;
            this.cdr.detectChanges();
          },
        });
      }
    }
  }

  nextSlide(): void {
    if (this.rooms.length > 0) {
      this.currentSlide = (this.currentSlide + this.imagesPerSlide) % this.rooms.length;
    }
  }

  prevSlide(): void {
    if (this.rooms.length > 0) {
      this.currentSlide = (this.currentSlide - this.imagesPerSlide + this.rooms.length) % this.rooms.length;
    }
  }

  openImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedImage = null;
  }

  toggleFavorite(hotel: Hotel): void {
    if (hotel) {
      if (this.favoritesService.isFavorite(hotel.id)) {
        this.favoritesService.removeFavorite(hotel.id);
      } else {
        this.favoritesService.addFavorite(hotel);
      }
    }
  }

  isFavorite(hotel: Hotel): boolean {
    return hotel ? this.favoritesService.isFavorite(hotel.id) : false;
  }

  toggleRoomDetails(roomId: string): void {
    this.openRoomId = this.openRoomId === roomId ? null : roomId;
  }

  isRoomOpen(roomId: string): boolean {
    return this.openRoomId === roomId;
  }

  getRoomServices(room: Room): string[] {
    const services: RoomService[] = [];

    services.push(ROOM_SERVICES.find(service => service.name === 'WiFi')!);
    services.push(ROOM_SERVICES.find(service => service.name === 'Air Conditioning')!);
    services.push(ROOM_SERVICES.find(service => service.name === 'Breakfast')!);
    services.push(ROOM_SERVICES.find(service => service.name === 'Swimming Pool')!);
    services.push(ROOM_SERVICES.find(service => service.name === 'Fitness Center')!);

    return services.map(service => service.icon);
  }

  fetchRooms() {
    this['roomService'].getRooms().subscribe((rooms: any[]) => {
      rooms.forEach(room => {
        const roomServices = this.getRoomServices(room);
        console.log('Services for room', room.roomName, roomServices);
      });
    });
  }

  getRoomServiceNames(room: Room): string[] {
    return room.services.map(service => service.name);
  }
}