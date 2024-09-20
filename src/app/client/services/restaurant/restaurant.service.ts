import { Injectable } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { environment } from 'src/environments/environment';
import { reservationRequest } from '../../models/reservation.request';
import { RestaurantLogin } from '../../models/restaurant.login.request';
import { from } from 'rxjs';
import { CapacitorHttp } from '@capacitor/core';
import { MenuRequest } from '../../models/menu.request';
import { RestauntRequest } from '../../models/restaurant.request';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  restaurants: Restaurant[] = []; 

  constructor() { }

  async getOnRestaurant(path:string){
    const options = {
      url: environment.baseUrl+path
    }
    return from(CapacitorHttp.get(options));
    //return from(Http.get(options));
    //return await this.http.get(environment.baseUrl+path);
  }

  async makeReservation(path:string, reservation: reservationRequest){

    const options = {
      url: environment.baseUrl+path,
      headers: { 'Content-Type': 'application/json' },
      data: reservation
    }
    return from(CapacitorHttp.post(options));
    //return await this.http.post(environment.baseUrl+path, reservation);
  }

  async deleteReservation(reservationNumber: string){
    const options = {
      url: environment.baseUrl+environment.reservationPath+reservationNumber
    }

    return from(CapacitorHttp.delete(options));

    //return await this.http.delete(environment.baseUrl+environment.reservationPath+reservationNumber);
  }

  async loginRestaurant(loginRequest: RestaurantLogin){

    const options = {
      url: environment.baseUrl+environment.restaurantLoginPath,
      headers: { 'Content-Type': 'application/json' },
      data: loginRequest
    }
    return from(CapacitorHttp.post(options));

    //return await this.http.post(environment.baseUrl+environment.restaurantLoginPath, loginRequest);
  }

  async getRestaurantReservation(id:number){

    const options = {
      url: environment.baseUrl+environment.allReservationPath+id
    }
    return from(CapacitorHttp.get(options));

  }

  async postMenu(menuRequest: MenuRequest){

    const options = {
      url: environment.baseUrl+environment.addMenuPath,
      headers: { 'Content-Type': 'application/json' },
      data: menuRequest
    }

    return from(CapacitorHttp.post(options));
  }

  async updateRestaurant(restaurantRequest: RestauntRequest , restaurantId: number){

    const options = {
      url: environment.baseUrl+environment.getOneRestaurantPath+restaurantId,
      headers: { 'Content-Type': 'application/json' },
      data: restaurantRequest
    }

    return from(CapacitorHttp.put(options));
  }
}
