import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

@Component({
  selector: 'app-all-restaurants',
  templateUrl: './all-restaurants.component.html',
  styleUrls: ['./all-restaurants.component.scss'],
})
export class AllRestaurantsComponent  implements OnInit {
  restaurants: Restaurant[] = [
    {
      id: 1,
      name: 'Le Bistro',
      type: 'Café',
      openingHours: '8h - 20h',
      closingHours: '12h',
      city: 'Yaoundé',
      image: 'https://via.placeholder.com/300x200',
      address:'',
      phone: '',
      email: '',
      description: '',
      rating: 0,
      capacity: 0,
      menuDtoList : [],
      isOpen: false,

    },
    {
      id: 2,
      name: 'Burger King',
      type: 'Fast-Food',
      openingHours: '10h - 22h',
      closingHours: '12h',
      city: 'Douala',
      image: 'https://via.placeholder.com/300x200',
      address:'',
      phone: '',
      email: '',
      description: '',
      rating: 0,
      capacity: 0,
      menuDtoList : [],
      isOpen: true,
    }
    // Ajoutez d'autres données de restaurants ici
  ];

  filteredRestaurants: Restaurant[] = [];
  selectedCity: string = 'yaoundé';
  selectedType: string = '';
  openOnly: boolean = false;
  searchTerm: string = '';

  constructor(private router: Router, private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.filterRestaurants();
  }

  filterRestaurants() {

    this.restaurantService.getRestaurants(this.selectedCity).subscribe(
      (response) => {
        console.log("Data: "+response);
        //this.restaurants = response.data.content;
      }
    );

    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const cityMatch = this.selectedCity === '' || restaurant.city.toLowerCase() === this.selectedCity.toLowerCase();
      const typeMatch = this.selectedType === '' || restaurant.type.toLowerCase() === this.selectedType.toLowerCase();
      const openMatch = !this.openOnly || restaurant.isOpen;
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
