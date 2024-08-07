import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'All restaurants', url: '/restaurants/all', icon: 'restaurant' },
    { title: 'My Reservations', url: '/reservations/', icon: 'bookmarks' },
  ];
  public labels = ['Food', 'Fun', ];
  constructor() {}
}
