import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './share-location.component.html',
  styleUrls: ['./share-location.component.scss']
})
export class ShareLocationComponent {
  location = {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  };

  submitLocation() {
    console.log('Location shared:', this.location);
    alert('Location sharing feature coming soon!');
  }
} 