import { Component, OnInit, ViewChild } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { environment } from 'src/environments/environment';
import { reservationRequest } from '../../models/reservation.request';
import { NgForm } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { reservationDto } from '../../models/reservation.dto';
import { LocalStorageService } from '../../services/storage/local-storage.service';
import { ToastController } from '@ionic/angular';
import { UserService } from '../../services/authentication/user.service';
import { HttpResponse } from '@capacitor-community/http';
import { EditMenuModalComponent } from './edit-menu-modal.component';
import { MenuRequest } from '../../models/menu.request';
import { EditRestaurantModalComponent } from './edit-restaurant.component';
import { RestauntRequest } from '../../models/restaurant.request';

@Component({
  selector: 'app-one-restaurant',
  templateUrl: './one-restaurant.component.html',
  styleUrls: ['./one-restaurant.component.scss'],
})
export class OneRestaurantComponent implements OnInit {
  restaurant: Restaurant | undefined ;
  invalidForm: boolean = false;
  isLoading = false;
  restaurantId!: string | null;
  reservationList: reservationDto[] = [];
  reservationDto!: reservationDto;

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
  isConnected: boolean = false;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';

  reservationDate: string = this.myFormatDate(new Date());
  startTime: string = new Date().toISOString();
  endTime: string = new Date().toISOString();
  reservationSeats: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private localStorage: LocalStorageService,
    private toastController: ToastController,
    private userService: UserService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.userService.isConnected$.subscribe((isConnected) => {
      this.isConnected = isConnected;
    });
    const restaurantId = (this.restaurantId =
      this.route.snapshot.paramMap.get('id'));
    (
      await this.restaurantService.getOnRestaurant(
        environment.getOneRestaurantPath + restaurantId
      )
    ).subscribe((response: HttpResponse) => {
      this.restaurant = response.data.content;
    });
  }


  // *******************************************************************MAIN FUNCTIONS*******************************************************************

  
  //Make an reservation
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

      const restaurantId = Number.parseInt(this.restaurantId || '4');
      this.reservation.restaurantId = restaurantId;
      (
        await this.restaurantService.makeReservation(
          environment.reservationPath,
          this.reservation
        )
      ).subscribe(async (response: HttpResponse) => {
        if (response) {
          if (response.status == 200) {
            console.log(response.data.content);

            this.reservationList = await this.localStorage.get(
              environment.reservationListKey
            );
            this.reservationDto = response.data.content;

            this.reservationList.push(this.reservationDto);
            await this.localStorage.set(
              environment.reservationListKey,
              this.reservationList
            );

            this.isLoading = false;

            form.resetForm();
            this.cancel();
            this.presentToast('middle', 'Reservation réussie', 'success');
          } else if (response.status == 400) {
            this.isLoading = false;
            this.presentToast(
              'top',
              response.data.validationErrors[0],
              'danger'
            );
          } else {
            this.isLoading = false;
            this.presentToast('top', response.data.errorMessage, 'danger');
          }
        } else {
          this.isLoading = false;
          this.presentToast('top', 'Erreur lors de la communication', 'danger');
        }
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

  //Edit Menu details per days
  async openEditModal(day: string){

    const menu = this.restaurant?.menuDtoList.find(m => m.days === day);
    const modal = await this.modalController.create({
      component: EditMenuModalComponent,
      componentProps: {
        day: day,
        dishes: menu ? [...menu.dishes] : []
      },
      cssClass: 'menu-edit-modal' // Vous pouvez définir des styles spécifiques pour ce modal
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      // Mettre à jour le menu avec les nouvelles données
      if (menu) {
        menu.dishes = data;
      } else {
        this.restaurant?.menuDtoList.push({ days: day, dishes: data });
      }

      this.isLoading = true;

      const restaurantId = Number.parseInt(this.restaurantId || '0');
      const menuRequest: MenuRequest = {
        dishes: data,
        days: day,
        restaurantId: restaurantId
      };

      (await this.restaurantService.postMenu(menuRequest)).subscribe(
        (response: HttpResponse)=> {
          if(response){

            if(response.status==201){
              this.isLoading = false;
              this.presentToast('top', 'Modification réussie', 'success');
            }else if (response.status == 400) {
              this.isLoading = false;
              this.presentToast(
                'top',
                response.data.validationErrors[0],
                'danger'
              );
            } else {
              this.isLoading = false;
              this.presentToast('top', response.data.errorMessage, 'danger');
            }
          } else {
            this.isLoading = false;
            this.presentToast('top', 'Erreur lors de la communication', 'danger');
          }
        }
      )
    }

  }

  //Edit restaurant details
  async openEditRestaurantModal(){
    const modal = await this.modalController.create({
      component: EditRestaurantModalComponent,
      componentProps: {
        restaurant: { ...this.restaurant } // Création d'une copie pour éviter la modification directe
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      // Mettre à jour les informations du restaurant
      
      

      const restaurantRequest: RestauntRequest = {
        name: data.name,
        city: this.restaurant?.city,
        address: data.address,
        phone: data.phone,
        type: data.type,
        email: data.email,
        description: data?.description,
        openingHours: data?.openingHours,
        capacity: data.capacity,
        closingHours: data.closingHours
      }

      const restaurantId = Number.parseInt(this.restaurantId || '0');
      
      this.isLoading = true;
      // Envoyer les modifications à l'API
       (await this.restaurantService.updateRestaurant(restaurantRequest, restaurantId)).subscribe(
        (response: HttpResponse) => {
          if(response){
            if(response.status==200){
              this.isLoading = false;
              this.presentToast('top', 'Modification réussie', 'success');
              this.ngOnInit();
            }else if (response.status == 400) {
              this.isLoading = false;
              this.presentToast(
                'top',
                response.data.validationErrors[0],
                'danger'
              );
            } else {
              this.isLoading = false;
              this.presentToast('top', response.data.errorMessage, 'danger');
            }
          }
          else {
            this.isLoading = false;
            this.presentToast('top', 'Erreur lors de la communication', 'danger');
          }
        },);
    }
  }




  // *******************************************************************UTILS*******************************************************************
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

 /* viewMap() {
    this.router.navigate(['/restaurants/map', this.restaurant?.address]);
  }*/

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


}
