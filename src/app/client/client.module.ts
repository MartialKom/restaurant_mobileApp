import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { AllRestaurantsComponent } from './pages/all-restaurants/all-restaurants.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [AllRestaurantsComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    IonicModule,
  ]
})
export class ClientModule { }
