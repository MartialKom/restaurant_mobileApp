import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = environment.restaurantLoginKey // Clé pour le localStorage

  constructor(private localStorage: LocalStorageService,) { }

  async isAuthenticated(){
    return await this.localStorage.get(this.AUTH_KEY);
  }

  async login(token: any) {
    await this.localStorage.set(this.AUTH_KEY, token);
  }

  logout(): void {
    this.localStorage.removeItem(this.AUTH_KEY)
  }

  async getToken() {
    const token = await this.localStorage.get("user");
    console.log("Token récupéré:", token); 
    return token;
  }
}
