import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, IonRouterOutlet } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { CalendarComponent } from 'ionic2-calendar';
import { CalendarMode, IEvent, Step } from 'ionic2-calendar/calendar.interface';
import { CalEvent } from '../../models/calEvent';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { environment } from 'src/environments/environment';
import { reservationDto } from '../../models/reservation.dto';
import { HttpResponse } from '@capacitor-community/http';

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss'],
})
export class ReservationCalendarComponent implements OnInit {

  eventSource: any[] = [];
  restaurantId: any;
  reservationList: reservationDto[] =[];
  isLoading:boolean = false;

  showStart = false;
  showEnd=false;
  formattedStart = '';
  formattedEnd = '';

  newEvent: any = {
    title: '',
    allDay: false,
    startTime: null,
    endTime: null
  };
  
  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
    step: 15 as Step,
    startingDayWeek: 1
  }
  viewTitle = '';

  @ViewChild(CalendarComponent) myCal !: CalendarComponent;
  @ViewChild('modal') modal !: IonModal;
  presentingElement:any = null;


  constructor(private route: ActivatedRoute, private ionRouterOutlet: IonRouterOutlet, private restaurantService: RestaurantService) {
    this.presentingElement = ionRouterOutlet.nativeEl;
  }


  async ngOnInit() {
    this.isLoading = true;
    const restaurantId = this.restaurantId = this.route.snapshot.paramMap.get('id');
      (await this.restaurantService.getRestaurantReservation(this.restaurantId)).subscribe(
         (response:HttpResponse)=>{
          if(response.data.content){
            this.reservationList = response.data.content;
            this.eventSource = this.transformReservations(this.reservationList);
            this.isLoading = false;
          }
        }
      )
    
  }

  onCurrentDateChanged($event: Date) {
  }
  onEventSelected($event: IEvent) {
  }
  onViewTitleChanged($event: string) {
  }
  onTimeSelected(event: {selectedTime:Date; events: any[]}) {
    this.formattedStart = format(event.selectedTime, 'd MM yyyy, HH:mm');
    this.newEvent.startTime = format(event.selectedTime, "YYY-MM-dd'T'HH:mm:ss");

    const later = event.selectedTime.setHours(event.selectedTime.getHours()+2);
    this.formattedEnd = format(later, 'd MM yyyy, HH:mm');

    this.newEvent.endTime = format(later, "YYY-MM-dd'T'HH:mm:ss");

    if(this.calendar.mode === 'day' || this.calendar.mode === 'week'){
      this.modal.present();
    }
  }

  setToday(){

    this.myCal.currentDate = new Date();
  }

  back(){
    this.myCal.slidePrev();
  }

  next(){
    this.myCal.slideNext();
  }

  scheduleEvent() {
    const toAdd: CalEvent = {
      title: this.newEvent.title,
      startTime: new Date(this.newEvent.startTime),
      endTime: new Date(this.newEvent.endTime),
      allDay: false
    }

    this.eventSource.push(toAdd);
    this.myCal.loadEvents();

    this.newEvent = {
      title: '',
      allDay: false,
      startTime: null,
      endTime: null
    };

    this.modal.dismiss();
  }

  startChanged(value: any){
    this.newEvent.startTime = value;
    this.formattedStart = format(parseISO(value), 'd MM yyyy, HH:mm');
  }

  endChanged(value: any){
    this.newEvent.endTime = value;
    this.formattedEnd = format(parseISO(value), 'd MM yyyy, HH:mm');
  }

  createDate(dateString: string, timeString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  transformReservations(reservations: any[]): any[] {

    return reservations.map(reservation => {
      const startDate = this.createDate(reservation.reservationDate, reservation.startTime);
      const endDate = this.createDate(reservation.reservationDate, reservation.endTime);

      return {
        title: `Reservation de ${reservation.clientName} - ${reservation.nbOfPeople} PLS`,
        allDay: false,
        startTime: startDate,
        endTime: endDate
      };
    });
  }
}
