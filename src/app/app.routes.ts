import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { ContactComponent } from './components/contact/contact.component';
import { HotelDetailsComponent } from './components/hoteldetails/hoteldetails.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/dashboard/user-profile/user-profile.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { AuthGuard } from './guards/auth.guard';
import { RoomDetailsComponent } from './components/rooms/rooms.component';
import { BookingComponent } from './components/booking/booking.component';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, title: 'მთავარი გვერდი' },
    { path: 'about', component: AboutComponent, title: 'ჩვენს შესახებ' },
    { path: 'hotels', component: HotelsComponent, title: 'სასტუმროები' },
    { path: 'hotel/:id', component: HotelDetailsComponent, title: 'სასტუმროს დეტალები' },
    { path: 'rooms/:id', component: RoomDetailsComponent, title: 'სასტუმროს ოთახის დეტალები'},
    { path: 'contact', component: ContactComponent, title: 'კონტაქტი' },
    { path: 'search-results', component: SearchResultsComponent, title: 'ძიების შედეგები'},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'bookings', component: BookingComponent, canActivate: [AuthGuard] },
    { 
      path: 'dashboard', 
      component: DashboardComponent, 
      canActivate: [AuthGuard],
      children: [
        { path: 'user-profile', component: UserProfileComponent },
        { path: 'settings', component: SettingsComponent }
      ]
    },
    { path: '**', component: PageNotFoundComponent, title: '404 - გვერდი ვერ მოიძებნა' },
];
