import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './client/services/storage/local-storage.service';
import { reservationDto } from './client/models/reservation.dto';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Restaurants', url: '/restaurants/all', icon: 'restaurant' },
    { title: 'Mes Reservations', url: '/restaurants/reservations', icon: 'bookmarks' },
  ];
  listReservation: reservationDto[] = [];
  public labels = ['Food', 'Fun'];
  constructor(private localStorage: LocalStorageService) {}

  async ngOnInit() {
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
}
