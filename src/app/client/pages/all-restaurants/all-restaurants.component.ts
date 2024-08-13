import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-restaurants',
  templateUrl: './all-restaurants.component.html',
  styleUrls: ['./all-restaurants.component.scss'],
})
export class AllRestaurantsComponent  implements OnInit {
  restaurants: Restaurant[] = [] ;

  filteredRestaurants: Restaurant[] = [];
  selectedCity: string = 'yaoundé';
  selectedType: string = '';
  openOnly: boolean = false;
  searchTerm: string = '';

  constructor(private router: Router, private restaurantService: RestaurantService) { }

  async ngOnInit() {
    (await this.restaurantService.getOnRestaurant(environment.getAllRestaurantPath+this.selectedCity)).subscribe(
      (response:any) => {
        console.log("Data: "+response.content);
        this.restaurants = response.content;
        this.filterRestaurants();
      }
    );    
  }

   filterRestaurants() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const cityMatch = this.selectedCity === '' || restaurant.city.toLowerCase() === this.selectedCity.toLowerCase();
      const typeMatch = this.selectedType === '' || restaurant.type.toLowerCase() === this.selectedType.toLowerCase();
      const openMatch = !this.openOnly || restaurant.open;
      const searchMatch = restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return cityMatch && typeMatch && openMatch && searchMatch;
    });
  }

  toggleOpenOnly() {
    this.openOnly = !this.openOnly;
    this.filterRestaurants();
  }

  viewRestaurantDetails(restaurant: Restaurant) {
    this.router.navigate(['/restaurants/one', restaurant.id]);
  }

}
