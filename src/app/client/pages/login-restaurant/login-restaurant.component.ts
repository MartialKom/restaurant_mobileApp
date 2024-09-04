import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { ToastController } from '@ionic/angular';
import { LocalStorageService } from '../../services/storage/local-storage.service';
import { RestaurantLogin } from '../../models/restaurant.login.request';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-restaurant',
  templateUrl: './login-restaurant.component.html',
  styleUrls: ['./login-restaurant.component.scss'],
})
export class LoginRestaurantComponent  implements OnInit {

  name: string | undefined;
  login: string | undefined;
  loading: boolean = false;

  constructor(private restaurantService: RestaurantService,
    private toastController: ToastController,
    private localStorage: LocalStorageService,
    private router: Router) { }

  ngOnInit(): void {
    
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: 'success' | 'danger'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: color,
      position: position,
    });

    await toast.present();
  }

  async restaurantLogin() {
    if (this.name && this.login) {
      this.loading = true;
      // Logique d'authentification ici
      console.log('name:', this.name);
      console.log('Mot de passe:', this.login);

      let restaurantLoginRequest: RestaurantLogin = {
        restaurantName: this.name,
        restaurantLogin: this.login
      };

      (await this.restaurantService.loginRestaurant(restaurantLoginRequest)).subscribe(
        (response: any)=>{
          this.localStorage.set(environment.restaurantLoginKey, this.name);
          this.loading = false;
          this.router.navigate(['/myrestaurant/calendar']);
        }, (err) => {
          console.log("An error occur: "+err.error);
          this.loading = false;

          if(err.status == 404){
            this.presentToast("top",err.error.errorMessage, "danger");
          } else
          this.presentToast("top","Erreur lors de la communication avec le serveur", "danger");
          
        }
      )
    }
  }

}
