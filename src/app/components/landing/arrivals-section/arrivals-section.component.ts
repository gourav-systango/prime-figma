import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../interfaces/shopping.interface';

@Component({
  selector: 'app-arrivals-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrivals-section.component.html',
  styleUrl: './arrivals-section.component.scss'
})
export class ArrivalsSectionComponent {
  categories: ProductCategory[] = [
    {
      id: '1',
      title: 'Hoodies & Sweetshirt',
      imagePath: 'images/hoodies.png',
      exploreLink: '#'
    },
    {
      id: '2',
      title: 'Coats & Parkas',
      imagePath: 'images/coats.png',
      exploreLink: '#'
    },
    {
      id: '3',
      title: 'Tees & T-Shirt',
      imagePath: 'images/tshirts.png',
      exploreLink: '#'
    }
  ];
}
