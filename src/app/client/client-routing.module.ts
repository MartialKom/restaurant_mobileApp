import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRestaurantsComponent } from './pages/all-restaurants/all-restaurants.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
