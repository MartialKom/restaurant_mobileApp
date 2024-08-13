import { Injectable } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  restaurants: Restaurant[] = []; 

  constructor(private http: HttpClient) { }

  async getOnRestaurant(path:string){
    return await this.http.get(environment.baseUrl+path);
  }
}
