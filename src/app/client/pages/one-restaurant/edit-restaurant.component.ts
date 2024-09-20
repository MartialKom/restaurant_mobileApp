import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Restaurant } from '../../models/restaurant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-restaurant-modal',
  templateUrl: './edit-restaurant.component.html',
  styleUrl: './edit-restaurant.scss'
})
export class EditRestaurantModalComponent implements OnInit {
  @Input() restaurant!: Restaurant;
  restaurantForm!: FormGroup;

  constructor(private modalController: ModalController, private formBuilder: FormBuilder) {}


    ngOnInit(): void {
        this.restaurantForm = this.formBuilder.group({
            name: [this.restaurant.name, Validators.required],
            type: [this.restaurant.type, Validators.required],
            openingHours: [this.convertTimeToISO(this.restaurant.openingHours), Validators.required],
            closingHours: [this.convertTimeToISO(this.restaurant.closingHours), Validators.required],
            description: [this.restaurant.description, Validators.required],
            address: [this.restaurant.address, Validators.required],
            capacity: [this.restaurant.capacity, [Validators.required, Validators.min(1)]],
            phone: [this.restaurant.phone, Validators.required],
            email: [this.restaurant.email],
          });
    }



  saveChanges() {
    if (this.restaurantForm.valid) {
      const formData = this.restaurantForm.value;
      
      // Formater les heures en "HH:mm"
      formData.openingHours = this.convertISOToTime(formData.openingHours);
      formData.closingHours = this.convertISOToTime(formData.closingHours);

        this.modalController.dismiss(formData);
      } else {
        Object.values(this.restaurantForm.controls).forEach(control => {
          control.markAsTouched();
        });
      }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  convertTimeToISO(time: string): string {
    if (!time) return '';
    // Créer une date factice pour aujourd'hui avec l'heure spécifiée
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date.toISOString();
  }

  convertISOToTime(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }





}