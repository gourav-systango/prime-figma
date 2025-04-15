import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCategory } from '../../interfaces/shopping.interface';
import { ProductService } from '../../services/product.service';
import { Product, ProductFilters } from '../../interfaces/product.interface';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-catalogue-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ProductListComponent, 
    ProductFiltersComponent,
    ProgressSpinnerModule
  ],
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
  currentFilters: ProductFilters | null = null;
  isLoading: boolean = false;
  
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
        // Apply current category filter automatically
        const categoryFilter: ProductFilters = {
          categories: [this.currentCategory],
          subCategories: [],
          priceRange: { min: 0, max: 1000 },
          colors: [],
          sizes: [],
          tags: [],
          sortBy: 'newest'
        };
        this.currentFilters = categoryFilter;
        this.loadFilteredProducts();
      } else {
        this.showCategoryGrid = true;
        this.currentFilters = null;
        // Load all products when on main catalogue page
        this.isLoading = true;
        this.productService.getProducts().subscribe(products => {
          this.products = products;
          this.isLoading = false;
        });
      }
    });
  }
  
  // Handle filter changes from the product-filters component
  handleFilterChange(filters: ProductFilters): void {
    // Save the current filters
    this.currentFilters = filters;
    
    // Load products with these filters
    this.loadFilteredProducts();
  }
  
  // Load products based on current filters
  loadFilteredProducts(): void {
    this.isLoading = true;
    
    if (this.currentFilters) {
      this.productService.getFilteredProducts(this.currentFilters).subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading filtered products:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.productService.getProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading = false;
        }
      });
    }
  }
  
  // Navigate to category page when a category is clicked
  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/catalogue', categoryId]);
  }
} 