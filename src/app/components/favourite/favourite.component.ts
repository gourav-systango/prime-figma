import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FavouriteItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent {
  favouriteItems: FavouriteItem[] = [
    {
      id: '1',
      name: 'Elegant Wool Coat',
      imageUrl: 'images/favourite/item1.jpg',
      price: 189.99,
      category: 'Outerwear'
    },
    {
      id: '2',
      name: 'Designer Leather Handbag',
      imageUrl: 'images/favourite/item2.jpg',
      price: 229.99,
      category: 'Accessories'
    },
    {
      id: '3',
      name: 'Premium Denim Jeans',
      imageUrl: 'images/favourite/item3.jpg',
      price: 129.99,
      category: 'Bottoms'
    },
    {
      id: '4',
      name: 'Luxury Silk Blouse',
      imageUrl: 'images/favourite/item4.jpg',
      price: 99.99,
      category: 'Tops'
    },
    {
      id: '5',
      name: 'Classic Leather Boots',
      imageUrl: 'images/favourite/item5.jpg',
      price: 159.99,
      category: 'Footwear'
    },
    {
      id: '6',
      name: 'Premium Cashmere Sweater',
      imageUrl: 'images/favourite/item6.jpg',
      price: 149.99,
      category: 'Knitwear'
    }
  ];

  removeFromFavourites(id: string): void {
    this.favouriteItems = this.favouriteItems.filter(item => item.id !== id);
  }
} 