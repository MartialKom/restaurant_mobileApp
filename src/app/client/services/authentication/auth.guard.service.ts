import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

   async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    
      let authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      return true;
    } else {
      return this.router.createUrlTree(['/restaurants/all']);
    }
  }
}
