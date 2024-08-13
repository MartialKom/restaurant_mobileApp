import { Component, OnInit, ViewChild } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { environment } from 'src/environments/environment';
import { reservationRequest } from '../../models/reservation.request';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-one-restaurant',
  templateUrl: './one-restaurant.component.html',
  styleUrls: ['./one-restaurant.component.scss'],
})
export class OneRestaurantComponent  implements OnInit {

  restaurant: Restaurant | undefined ;
  reservation: reservationRequest | undefined;
  daysOfWeek = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE', 'ALLDAYS'];
  colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
  isModalOpen = false;
  reservationName!: string;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';

  reservationDate!: string;
  startTime!: string;
  endTime!: string;
  reservationSeats!: number;
  
  constructor(private route: ActivatedRoute, private router: Router, private restaurantService: RestaurantService) { }

  async ngOnInit() {
    const restaurantId = this.route.snapshot.paramMap.get('id');
    (await this.restaurantService.getOnRestaurant(environment.getOneRestaurantPath+restaurantId)).subscribe(
      (response:any)=>{
        this.restaurant = response.content;
      }
    )
  }

  makeReservation() {
    // Logique pour faire une réservation
    this.isModalOpen = true;
  }

  viewMap(){
    this.router.navigate(['/restaurants/map', this.restaurant?.address]);
  }

  getDishColor(index: number): string {
    return this.colors[index % this.colors.length];
  }


  dismissModal() {
    this.isModalOpen = false;
  }

  onDateChange(event: any) {
    this.reservation!.reservationDate = event.detail.value;
  }

  onStartTimeChange(event: any) {
    this.reservation!.startTime = event.detail.value;
  }

  onEndTimeChange(event: any) {
    this.reservation!.endTime = event.detail.value;
  }

  onSubmitReservation(form: NgForm) {
    if (form.valid) {
      // Traiter la soumission du formulaire ici
      console.log('Réservation soumise:', form.value);
      this.dismissModal();
      // Réinitialiser les champs du formulaire après la soumission
      this.reservationDate = "";
      this.startTime = "";
      this.endTime = "";
      this.reservationName = "";
      this.reservationSeats = 0;
      form.resetForm();
    }

  }

  @ViewChild(IonModal) modal: IonModal | undefined;


  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal!.dismiss(this.reservation?.clientName, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

}
