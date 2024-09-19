import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './client/services/storage/local-storage.service';
import { reservationDto } from './client/models/reservation.dto';
import { environment } from 'src/environments/environment';
import { AuthService } from './client/services/authentication/auth.service';
import { UserService } from './client/services/authentication/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Restaurants', url: '/restaurants/all', icon: 'restaurant' },
    { title: 'Mes Reservations', url: '/restaurants/reservations', icon: 'bookmarks' },
    { title: 'Connexion', url: '/restaurants/login', icon: 'person-circle' },
    
  ];

  public appConectedPages = [
    { title: 'Mon restaurant', url: '/restaurants/one/', icon: 'restaurant' },
    { title: 'Reservations', url: '/restaurants/calendar/', icon: 'bookmarks' },
  ];

  restaurantId!: any ;
  isConnected: boolean = false;

  listReservation: reservationDto[] = [];
  public labels = ['Food', 'Fun'];
  constructor(private localStorage: LocalStorageService, 
    private router: Router,
    private authService: AuthService, 
    private userService: UserService) {}

  async ngOnInit() {

    this.userService.isConnected$.subscribe(async isConnected => {
      this.isConnected = isConnected;
      if(this.isConnected){
        this.restaurantId = await this.authService.getToken();
        console.log("Restaurant ID: "+this.restaurantId);
  
      }
    });

    const storedReservationList = await this.localStorage.get(
      environment.reservationListKey
    );

    if(!storedReservationList){
      console.log("create reservationList on local storage");
      await this.localStorage.set(
        environment.reservationListKey,
        this.listReservation
      );
    } else console.log("ReservationList exist on localStorage");
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/restaurants/all']); // Redirection vers la page de login
  }
}
