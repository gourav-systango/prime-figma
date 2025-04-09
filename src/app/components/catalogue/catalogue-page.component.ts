import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../interfaces/shopping.interface';

@Component({
  selector: 'app-catalogue-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogue-page.component.html',
  styleUrl: './catalogue-page.component.scss'
})
export class CataloguePageComponent {
  categories: ProductCategory[] = [
    {
      id: '1',
      title: 'Women\'s Clothing',
      imagePath: 'images/catalogue/womens-clothing.jpg',
      exploreLink: '#'
    },
    {
      id: '2',
      title: 'Men\'s Clothing',
      imagePath: 'images/catalogue/mens-clothing.jpg',
      exploreLink: '#'
    },
    {
      id: '3',
      title: 'Kids Collection',
      imagePath: 'images/catalogue/kids-collection.jpg',
      exploreLink: '#'
    },
    {
      id: '4',
      title: 'Accessories',
      imagePath: 'images/catalogue/accessories.jpg',
      exploreLink: '#'
    },
    {
      id: '5',
      title: 'Footwear',
      imagePath: 'images/catalogue/footwear.jpg',
      exploreLink: '#'
    },
    {
      id: '6',
      title: 'Sale Items',
      imagePath: 'images/catalogue/sale-items.jpg',
      exploreLink: '#'
    }
  ];
} 