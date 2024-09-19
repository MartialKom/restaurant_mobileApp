import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  isConnected$ = this.isConnectedSubject.asObservable();

  setConnected(isConnected: boolean) {
    this.isConnectedSubject.next(isConnected);
  }

  logout() {
    this.setConnected(false);
  }
}
