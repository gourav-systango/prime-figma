import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCategory } from '../../interfaces/shopping.interface';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';

@Component({
  selector: 'app-catalogue-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductListComponent, ProductFiltersComponent],
  templateUrl: './catalogue-page.component.html',
  styleUrl: './catalogue-page.component.scss'
})
export class CataloguePageComponent implements OnInit {
  categories: ProductCategory[] = [
    {
      id: 'womens-clothing',
      title: 'Women\'s Clothing',
      imagePath: 'images/catalogue/womens-clothing.jpg',
      exploreLink: '/catalogue/womens-clothing'
    },
    {
      id: 'mens-clothing',
      title: 'Men\'s Clothing',
      imagePath: 'images/catalogue/mens-clothing.jpg',
      exploreLink: '/catalogue/mens-clothing'
    },
    {
      id: 'kids-collection',
      title: 'Kids Collection',
      imagePath: 'images/catalogue/kids-collection.jpg',
      exploreLink: '/catalogue/kids-collection'
    },
    {
      id: 'accessories',
      title: 'Accessories',
      imagePath: 'images/catalogue/accessories.jpg',
      exploreLink: '/catalogue/accessories'
    },
    {
      id: 'footwear',
      title: 'Footwear',
      imagePath: 'images/catalogue/footwear.jpg',
      exploreLink: '/catalogue/footwear'
    },
    {
      id: 'sale-items',
      title: 'Sale Items',
      imagePath: 'images/catalogue/sale-items.jpg',
      exploreLink: '/catalogue/sale-items'
    }
  ];
  
  products: Product[] = [];
  currentCategory: string | null = null;
  showCategoryGrid: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentCategory = params.get('category');
      
      if (this.currentCategory) {
        this.showCategoryGrid = false;
        // Load products filtered by category
        this.productService.getProductsByCategory(this.currentCategory).subscribe(products => {
          this.products = products;
        });
      } else {
        this.showCategoryGrid = true;
        // Load all products when on main catalogue page
        this.productService.getProducts().subscribe(products => {
          this.products = products;
        });
      }
    });
  }
  
  // Navigate to category page when a category is clicked
  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/catalogue', categoryId]);
  }
} 