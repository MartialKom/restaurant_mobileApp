import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
import { HttpResponse } from '@capacitor-community/http';

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
  isLoading = false;

  constructor(private router: Router, private restaurantService: RestaurantService,
    private toastController: ToastController) { }

  async ngOnInit() {
    this.isLoading = true;
    (await this.restaurantService.getOnRestaurant(environment.getAllRestaurantPath+this.selectedCity)).subscribe(
      (response:HttpResponse) => {
        console.log("Data: "+response.data.content);
        this.restaurants = response.data.content;
        this.filterRestaurants();
      },(err)=>{
        this.isLoading = false;
        this.presentToast("top","Erreur lors de la communication avec le serveur", "danger");
      }
    );    
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: color,
      position: position,
    });

    await toast.present();
  }

   filterRestaurants() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const cityMatch = this.selectedCity === '' || restaurant.city.toLowerCase() === this.selectedCity.toLowerCase();
      const typeMatch = this.selectedType === '' || restaurant.type.toLowerCase() === this.selectedType.toLowerCase();
      const openMatch = !this.openOnly || restaurant.open;
      const searchMatch = restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return cityMatch && typeMatch && openMatch && searchMatch;
    });
    this.isLoading = false;
  }

  toggleOpenOnly() {
    this.openOnly = !this.openOnly;
    this.filterRestaurants();
  }

  viewRestaurantDetails(restaurant: Restaurant) {
    this.router.navigate(['/restaurants/one', restaurant.id]);
  }

}
