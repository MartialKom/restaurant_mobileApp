import { Injectable } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  restaurants: Restaurant[] = []; 

  constructor(private http: HttpClient) { }

  public getRestaurants(city:string){
    return this.http.get('http://localhost:8000/restaurant/city/'+city);
  }
}
