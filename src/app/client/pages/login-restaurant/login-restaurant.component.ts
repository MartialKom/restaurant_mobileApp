import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { ToastController } from '@ionic/angular';
import { RestaurantLogin } from '../../models/restaurant.login.request';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { UserService } from '../../services/authentication/user.service';

@Component({
  selector: 'app-login-restaurant',
  templateUrl: './login-restaurant.component.html',
  styleUrls: ['./login-restaurant.component.scss'],
})
export class LoginRestaurantComponent implements OnInit {
  name: string | undefined;
  login: string | undefined;
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private restaurantService: RestaurantService,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        restaurantLogin: this.login,
      };

      try {
        const observable = await this.restaurantService.loginRestaurant(
          restaurantLoginRequest
        );
        observable
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => (this.loading = false))
          )
          .subscribe(
            async (response: any) => {
              let id = response.content.id;
              await this.authService.login(id);
              console.log("login: "+id);
              this.userService.setConnected(true);
              this.router.navigate(['/restaurants/calendar', id]);
            },
            (err) => {
              console.log('An error occur: ' + err.error);
              if (err.status == 404) {
                this.presentToast('top', err.error.errorMessage, 'danger');
              } else {
                this.presentToast(
                  'top',
                  'Erreur lors de la communication avec le serveur',
                  'danger'
                );
              }
            }
          );
      } catch (error) {
        console.error("Erreur lors de l'appel au service:", error);
        this.loading = false;
        this.presentToast('top', 'Erreur inattendue', 'danger');
      }
    }
  }
}
