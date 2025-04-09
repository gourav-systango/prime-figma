import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FashionItem {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  price: string;
}

@Component({
  selector: 'app-fashion-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fashion-page.component.html',
  styleUrl: './fashion-page.component.scss'
})
export class FashionPageComponent {
  fashionItems: FashionItem[] = [
    {
      id: '1',
      title: 'Hoodies & Sweetshirt',
      description: 'Explore our cozy collection of hoodies and sweatshirts',
      imagePath: 'images/fashion/hoodies.jpg',
      price: '$195.00'
    },
    {
      id: '2',
      title: 'Coats & Parkas',
      description: 'Stay warm with our stylish coats and parkas',
      imagePath: 'images/fashion/coats.jpg',
      price: '$225.00'
    },
    {
      id: '3',
      title: 'Tees & T-Shirts',
      description: 'Classic and comfortable tees for everyday wear',
      imagePath: 'images/fashion/tees.jpg',
      price: '$155.00'
    }
  ];
} 