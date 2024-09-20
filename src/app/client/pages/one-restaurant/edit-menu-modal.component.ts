import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-menu-modal',
  templateUrl: './edit-menu-modal.component.html',
  styleUrl: './edit-menu.scss' 
})
export class EditMenuModalComponent {
  @Input() day!: string;
  @Input() dishes!: { name: string, price: number }[];

  constructor(private modalController: ModalController) {}

  addDish() {
    this.dishes.push({ name: '', price: 0 });
  }

  removeDish(index: number) {
    this.dishes.splice(index, 1);
  }

  saveChanges() {
    this.modalController.dismiss(this.dishes);
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}