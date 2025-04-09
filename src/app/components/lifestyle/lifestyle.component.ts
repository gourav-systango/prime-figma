import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LifestyleArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
}

interface TrendingItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

@Component({
  selector: 'app-lifestyle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lifestyle.component.html',
  styleUrls: ['./lifestyle.component.scss']
})
export class LifestyleComponent {
  articles: LifestyleArticle[] = [
    {
      id: '1',
      title: 'How to Style Oversized Blazers This Season',
      excerpt: 'The oversized blazer trend is here to stay. Discover fresh ways to incorporate this versatile piece into your everyday wardrobe.',
      imageUrl: 'images/lifestyle/articles/article1.png',
      category: 'Style Tips',
      date: 'April 10, 2024'
    },
    {
      id: '2',
      title: 'The Rise of Genderless Fashion',
      excerpt: 'Explore how designers are breaking traditional gender boundaries and creating inclusive collections that appeal to everyone.',
      imageUrl: 'images/lifestyle/articles/article2.jpg',
      category: 'Trends',
      date: 'April 5, 2024'
    },
    {
      id: '3',
      title: 'Sustainable Materials Revolutionizing Fashion',
      excerpt: 'From pineapple leather to recycled ocean plastic, discover the innovative materials shaping the future of sustainable fashion.',
      imageUrl: 'images/lifestyle/articles/article3.jpg',
      category: 'Sustainability',
      date: 'March 28, 2024'
    }
  ];

  trendingItems: TrendingItem[] = [
    {
      id: '1',
      name: 'Oversized Cotton Shirt',
      imageUrl: 'images/lifestyle/products/product1.jpg',
      price: 89.99
    },
    {
      id: '2',
      name: 'High-Waisted Wide Leg Jeans',
      imageUrl: 'images/lifestyle/products/product2.jpg',
      price: 129.99
    },
    {
      id: '3',
      name: 'Chunky Platform Sandals',
      imageUrl: 'images/lifestyle/products/product3.jpg',
      price: 149.99
    },
    {
      id: '4',
      name: 'Structured Mini Handbag',
      imageUrl: 'images/lifestyle/products/product4.jpg',
      price: 179.99
    }
  ];
}