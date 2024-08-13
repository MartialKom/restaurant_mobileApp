import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { AllRestaurantsComponent } from './pages/all-restaurants/all-restaurants.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OneRestaurantComponent } from './pages/one-restaurant/one-restaurant.component';


@NgModule({
  declarations: [AllRestaurantsComponent, OneRestaurantComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    IonicModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ClientModule { }
