import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf, NgFor } from '@angular/common';
import { BookingService } from '../../services/booking/booking.service';
import { Booking } from '../../services/booking/booking.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, NgIf, NgFor, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any = { name: '' };
  bookings: Booking[] = [];
  isDashboardActive: boolean = false;

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        this.user = { name: '' };
      }
    }

    this.bookings = this.bookingService.getBookings();

    this.checkDashboardRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkDashboardRoute();
      });
  }

  checkDashboardRoute(): void {
    this.isDashboardActive = this.router.url === '/dashboard';
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  removeBooking(bookingId: number): void {
    this.bookingService.removeBooking(bookingId);
    this.bookings = this.bookings.filter(
      (booking) => booking.bookingId !== bookingId
    );
  }
}
