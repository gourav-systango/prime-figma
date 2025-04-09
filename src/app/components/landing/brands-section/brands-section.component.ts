import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand } from '../../../interfaces/shopping.interface';

@Component({
  selector: 'app-brands-section',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './brands-section.component.html',
  styleUrl: './brands-section.component.scss'
})
export class BrandsSectionComponent {
  brands: Brand[] = [
    { id: '1', name: 'Brand 1', imagePath: 'images/brand1.png', link: '#' },
    { id: '2', name: 'Brand 2', imagePath: 'images/brand2.png', link: '#' },
    { id: '3', name: 'Brand 3', imagePath: 'images/brand3.png', link: '#' },
    { id: '4', name: 'Brand 4', imagePath: 'images/brand4.png', link: '#' },
    { id: '5', name: 'Brand 5', imagePath: 'images/brand5.png', link: '#' },
    { id: '6', name: 'Brand 6', imagePath: 'images/brand6.png', link: '#' }
  ];
}
