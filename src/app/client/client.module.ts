import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { AllRestaurantsComponent } from './pages/all-restaurants/all-restaurants.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OneRestaurantComponent } from './pages/one-restaurant/one-restaurant.component';
import { ReservationListComponent } from './pages/reservation-list/reservation-list.component';
import { LoginRestaurantComponent } from './pages/login-restaurant/login-restaurant.component';
import { NgCalendarModule } from 'ionic2-calendar';
import { ReservationCalendarComponent } from './pages/reservation-calendar/reservation-calendar.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { EditMenuModalComponent } from './pages/one-restaurant/edit-menu-modal.component';
registerLocaleData(localeFr);

@NgModule({
  declarations: [AllRestaurantsComponent, OneRestaurantComponent, ReservationListComponent, LoginRestaurantComponent, ReservationCalendarComponent,EditMenuModalComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    IonicModule,
    NgCalendarModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
  ]
})
export class ClientModule { }
