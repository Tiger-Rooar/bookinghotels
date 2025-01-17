import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelsService } from '../../services/hotels/hotels.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from '../../services/loading/loading.service';
import { ROOM_SERVICES } from '../../services/rooms/rooms-service';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule, NgStyle, RouterModule, CommonModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomDetailsComponent implements OnInit {
  roomId: number | null = null;
  roomDetails: any = null;
  hotel: any = null;
  isLoading: boolean = true;
  selectedImage: string | null = null;
  currentSlide: number = 0;
  imagesPerSlide: number = 4;
  totalSlides: number = 0;

  constructor(
    private hotelsService: HotelsService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.showLoading();

    this.roomId = +this.route.snapshot.paramMap.get('id')!;
    if (this.roomId) {
      this.fetchRoomDetails(this.roomId);
    }
  }

  fetchRoomDetails(id: number): void {
    this.hotelsService.getRoomDetails(id).subscribe(
      (data) => {
        if (!data.services || data.services.length === 0) {
          data.services = ROOM_SERVICES;
        }
        this.roomDetails = data;
        this.fetchHotelDetails(data.hotelId);
      },
      (error) => {
        console.error('Error fetching room details', error);
        this.isLoading = false;
        this.loadingService.hideLoading();
        this.cdr.detectChanges();
      }
    );
  }
  

  fetchHotelDetails(hotelId: number): void {
    this.hotelsService.getHotels(hotelId).subscribe(
      (data) => {
        this.hotel = data[0];
        this.isLoading = false;
        this.loadingService.hideLoading();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching hotel details', error);
        this.isLoading = false;
        this.loadingService.hideLoading();
        this.cdr.detectChanges();
      }
    );
  }

  getServiceDescription(serviceName: string): string {
    const service = ROOM_SERVICES.find(s => s.name === serviceName);
    return service ? service.description : '';
  }

  getServiceIcon(serviceName: string): string {
    const service = ROOM_SERVICES.find(s => s.name === serviceName);
    return service ? service.icon : '';
  }

  nextSlide(): void {
    if (this.roomDetails?.images?.length) {
      const totalSlides = Math.ceil(this.roomDetails.images.length / this.imagesPerSlide);
      this.currentSlide = (this.currentSlide + 1) % totalSlides;
      console.log(`Next Slide: Current Slide is ${this.currentSlide}`);
    }
  }
  
  prevSlide(): void {
    if (this.roomDetails?.images?.length) {
      const totalSlides = Math.ceil(this.roomDetails.images.length / this.imagesPerSlide);
      this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
      console.log(`Previous Slide: Current Slide is ${this.currentSlide}`);
    }
  }

  openImage(image: string): void {
    this.selectedImage = image;
  }

  closeImage(event?: Event): void {
    event?.stopPropagation();
    this.selectedImage = null;
  }
}