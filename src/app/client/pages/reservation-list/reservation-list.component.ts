import { Component, OnInit } from '@angular/core';
import { reservationDto } from '../../models/reservation.dto';
import { LocalStorageService } from '../../services/storage/local-storage.service';
import { AlertController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss'],
})
export class ReservationListComponent implements OnInit {
  reservationList: reservationDto[] = [];
  loading: boolean = false;

  constructor(
    private localStorage: LocalStorageService,
    private toastController: ToastController,
    private restaurantService: RestaurantService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.reservationList = await this.localStorage.get(
      environment.reservationListKey
    );

    if (this.reservationList.length < 1) {
      console.log('Aucune reservation...');
    }
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

  async cancelReservation(number: string, index: number) {
    this.loading = true;
    (await this.restaurantService.deleteReservation(number)).subscribe(
      (response: any) => {
        this.reservationList.splice(index, 1);
        this.presentToast('top', 'Reservation annulée', 'success');
        this.loading = false;
        this.localStorage.set(
          environment.reservationListKey,
          this.reservationList
        );
      },
      (err) => {
        this.loading = false;
        this.presentToast(
          'top',
          'Erreur lors de la communication avec le serveur',
          'danger'
        );
      }
    );
  }

  async presentAlert(number: string, index: number) {
    const alert = await this.alertController.create({
      header: 'Annuler la reservation',
      message: 'Voulez vous vraiment annuler cette reservation ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Oui',
          role: 'confirm',
          handler: () => this.cancelReservation(number, index)
        }
      ],
    });

    await alert.present();
  }
}
