import { Injectable } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { reservationRequest } from '../../models/reservation.request';
import { RestaurantLogin } from '../../models/restaurant.login.request';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  restaurants: Restaurant[] = []; 

  constructor(private http: HttpClient) { }

  async getOnRestaurant(path:string){
    return await this.http.get(environment.baseUrl+path);
  }

  async makeReservation(path:string, reservation: reservationRequest){
    return await this.http.post(environment.baseUrl+path, reservation);
  }

  async deleteReservation(reservationNumber: string){
    return await this.http.delete(environment.baseUrl+environment.reservationPath+reservationNumber);
  }

  async loginRestaurant(loginRequest: RestaurantLogin){
    return await this.http.post(environment.baseUrl+environment.restaurantLoginPath, loginRequest);
  }

  async getRestaurantReservation(id:number){
    return await this.http.get(environment.baseUrl+environment.allReservationPath+id);
  }
}
