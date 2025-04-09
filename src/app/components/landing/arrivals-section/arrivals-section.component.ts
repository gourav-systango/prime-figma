import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../interfaces/shopping.interface';

interface Arrival {
  id: string;
  title: string;
  price: string;
  imagePath: string;
}

@Component({
  selector: 'app-arrivals-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrivals-section.component.html',
  styleUrl: './arrivals-section.component.scss'
})
export class ArrivalsSectionComponent {
  arrivals: Arrival[] = [
    {
      id: '1',
      title: 'Hoodies & Sweetshirt',
      price: 'Explore Now!',
      imagePath: 'images/hoodies.jpg',
    },
    {
      id: '2',
      title: 'Coats & Parkas',
      price: 'Explore Now!',
      imagePath: 'images/coats.jpg',
    },
    {
      id: '3',
      title: 'Tees & T-Shirt',
      price: 'Explore Now!',
      imagePath: 'images/tees.jpg',
    }
  ];
}
