import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRestaurantsComponent } from './pages/all-restaurants/all-restaurants.component';
import { OneRestaurantComponent } from './pages/one-restaurant/one-restaurant.component';
import { ReservationListComponent } from './pages/reservation-list/reservation-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
      },
      {
        path: 'all',
        component: AllRestaurantsComponent
      },
      {
        path: 'one/:id',
        component: OneRestaurantComponent
      },
      {
        path: 'reservations',
        component: ReservationListComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
