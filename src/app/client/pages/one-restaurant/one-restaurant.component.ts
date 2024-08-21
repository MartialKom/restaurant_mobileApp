import { Component, OnInit, ViewChild } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { environment } from 'src/environments/environment';
import { reservationRequest } from '../../models/reservation.request';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { reservationDto } from '../../models/reservation.dto';
import { LocalStorageService } from '../../services/storage/local-storage.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-one-restaurant',
  templateUrl: './one-restaurant.component.html',
  styleUrls: ['./one-restaurant.component.scss'],
})
export class OneRestaurantComponent implements OnInit {
  restaurant: Restaurant | undefined;
  invalidForm: boolean = false;
  isLoading = false;
  restaurantId!: string | null;
  reservationList: reservationDto[] =[];
  reservationDto!: reservationDto ;

  reservation: reservationRequest = {
    restaurantId: 0,
    reservationDate: '',
    startTime: '',
    endTime: '',
    nbOfPeople: 0,
    clientName: '',
  };

  daysOfWeek = [
    'LUNDI',
    'MARDI',
    'MERCREDI',
    'JEUDI',
    'VENDREDI',
    'SAMEDI',
    'DIMANCHE',
    'ALLDAYS',
  ];
  colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];
  isModalOpen = false;
  reservationName!: string;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  reservationDate: string = this.myFormatDate(new Date());
  startTime: string = new Date().toISOString()
  endTime: string = new Date().toISOString()
  reservationSeats: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private localStorage: LocalStorageService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const restaurantId = this.restaurantId = this.route.snapshot.paramMap.get('id');
    (
      await this.restaurantService.getOnRestaurant(
        environment.getOneRestaurantPath + restaurantId
      )
    ).subscribe((response: any) => {
      this.restaurant = response.content;
    });
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



  makeReservation() {
    // Logique pour faire une réservation
    this.isModalOpen = true;
  }

  viewMap() {
    this.router.navigate(['/restaurants/map', this.restaurant?.address]);
  }

  getDishColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  dismissModal() {
    this.isModalOpen = false;
  }

  onDateChange(event: any) {
    this.invalidForm = false;
    this.reservationDate = event.detail.value;
  }

  onStartTimeChange(event: any) {
    this.invalidForm = false;
    this.startTime = event.detail.value;
  }

  onEndTimeChange(event: any) {
    this.invalidForm = false;
    this.endTime = event.detail.value;
  }

  async onSubmitReservation(form: NgForm) {
    if (form.valid) {
      this.invalidForm = false;
      this.isLoading = true;
      this.reservation.reservationDate = this.reservationDate.split('T')[0];

      console.log('date: ' + this.reservation.reservationDate);
      const date = new Date(this.startTime);
      const startHours = date.getHours().toString().padStart(2, '0');
      const startMinutes = date.getMinutes().toString().padStart(2, '0');

      this.reservation.startTime = `${startHours}:${startMinutes}`;
      console.log('start time: ' + this.reservation.startTime);

      const endDate = new Date(this.endTime);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

      this.reservation.endTime = `${endHours}:${endMinutes}`;
      console.log('end time: ' + this.reservation.endTime);

      this.reservation.clientName = this.reservationName;
      this.reservation.nbOfPeople = this.reservationSeats;

      const restaurantId = Number.parseInt(this.restaurantId || "4");
      this.reservation.restaurantId = restaurantId;
      (
        await this.restaurantService.makeReservation(
          environment.reservationPath,
          this.reservation
        )
      ).subscribe(async (response: any) => {

        if(response.content){
          console.log(response.content);

          this.reservationList =  await this.localStorage.get(environment.reservationListKey);
          this.reservationDto = response.content;

          this.reservationList.push(this.reservationDto);
          await this.localStorage.set(environment.reservationListKey, this.reservationList);

          this.isLoading = false;
          
          form.resetForm();
          this.cancel();
          this.presentToast("middle", "Reservation réussie", "success");
        } 

      },(err)=>{
        console.log("An error occur: "+err.error);
        this.isLoading = false;
        if(err.status == 400){
          this.presentToast("top",err.error.validationErrors[0], "danger");
        } else
        this.presentToast("top",err.error.errorMessage, "danger");
      });

    } else {
      this.invalidForm = true;
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

  myFormatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
