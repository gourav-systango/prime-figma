import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFilters, FilterOption } from '../../../interfaces/product.interface';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AccordionModule,
    CheckboxModule,
    SliderModule,
    RadioButtonModule
  ],
  templateUrl: './product-filters.component.html',
  styles: []
})
export class ProductFiltersComponent implements OnInit, OnChanges {
  @Input() currentCategory: string | null = null;
  @Output() filterChange = new EventEmitter<ProductFilters>();
  
  // Initialize with default filter values
  filters: ProductFilters = {
    categories: [],
    subCategories: [],
    priceRange: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
    tags: [],
    sortBy: 'newest'
  };
  
  // Category options - only shown when not in a specific category page
  categoryOptions: FilterOption[] = [
    { label: 'Women\'s Clothing', value: 'womens-clothing', count: 12 },
    { label: 'Men\'s Clothing', value: 'mens-clothing', count: 8 },
    { label: 'Kids Collection', value: 'kids-collection', count: 6 },
    { label: 'Accessories', value: 'accessories', count: 15 },
    { label: 'Footwear', value: 'footwear', count: 10 },
    { label: 'Sale Items', value: 'sale-items', count: 7 }
  ];
  
  // All subcategory options
  allSubCategories: { [key: string]: FilterOption[] } = {
    'womens-clothing': [
      { label: 'Dresses', value: 'dresses', count: 12 },
      { label: 'Tops', value: 'tops', count: 8 },
      { label: 'Jeans', value: 'jeans', count: 5 }
    ],
    'mens-clothing': [
      { label: 'T-Shirts', value: 't-shirts', count: 8 },
      { label: 'Shirts', value: 'shirts', count: 5 },
      { label: 'Suits', value: 'suits', count: 4 },
      { label: 'Jeans', value: 'jeans', count: 7 }
    ],
    'kids-collection': [
      { label: 'T-Shirts', value: 't-shirts', count: 6 },
      { label: 'Pants', value: 'pants', count: 4 }
    ],
    'accessories': [
      { label: 'Watches', value: 'watches', count: 9 },
      { label: 'Jewelry', value: 'jewelry', count: 7 },
      { label: 'Bags', value: 'bags', count: 6 }
    ],
    'footwear': [
      { label: 'Boots', value: 'boots', count: 5 },
      { label: 'Sneakers', value: 'sneakers', count: 8 },
      { label: 'Sandals', value: 'sandals', count: 4 }
    ],
    'sale-items': [
      { label: 'T-Shirts', value: 't-shirts', count: 3 },
      { label: 'Dresses', value: 'dresses', count: 2 },
      { label: 'Jackets', value: 'jackets', count: 6 }
    ]
  };
  
  // Current subcategory options (filtered based on category)
  subCategoryOptions: FilterOption[] = [];
  
  // Color options
  colorOptions: FilterOption[] = [
    { label: 'Black', value: '#000000', count: 18 },
    { label: 'White', value: '#FFFFFF', count: 12 },
    { label: 'Red', value: '#FF0000', count: 7 },
    { label: 'Blue', value: '#0000FF', count: 9 },
    { label: 'Green', value: '#00FF00', count: 5 },
    { label: 'Brown', value: '#8B4513', count: 8 }
  ];
  
  // Size options
  sizeOptions: FilterOption[] = [
    { label: 'XS', value: 'XS', count: 6 },
    { label: 'S', value: 'S', count: 10 },
    { label: 'M', value: 'M', count: 15 },
    { label: 'L', value: 'L', count: 12 },
    { label: 'XL', value: 'XL', count: 8 },
    { label: 'XXL', value: 'XXL', count: 4 }
  ];
  
  // Sort options
  sortOptions: { label: string, value: string }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating', value: 'rating' }
  ];
  
  constructor() { }
  
  ngOnInit(): void {
    this.updateSubcategories();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentCategory']) {
      this.resetFilters();
      this.updateSubcategories();
    }
  }
  
  // Update subcategories based on selected category
  updateSubcategories(): void {
    if (this.currentCategory && this.allSubCategories[this.currentCategory]) {
      this.subCategoryOptions = this.allSubCategories[this.currentCategory];
    } else {
      // If no category selected or invalid category, show all subcategories
      this.subCategoryOptions = Object.values(this.allSubCategories).flat();
    }
  }
  
  // Toggle a color filter
  toggleColor(colorValue: string): void {
    const index = this.filters.colors.indexOf(colorValue);
    if (index === -1) {
      // Add color if not already selected
      this.filters.colors.push(colorValue);
    } else {
      // Remove color if already selected
      this.filters.colors.splice(index, 1);
    }
    this.updateFilters();
  }
  
  // Toggle a size filter
  toggleSize(sizeValue: string): void {
    const index = this.filters.sizes.indexOf(sizeValue);
    if (index === -1) {
      // Add size if not already selected
      this.filters.sizes.push(sizeValue);
    } else {
      // Remove size if already selected
      this.filters.sizes.splice(index, 1);
    }
    this.updateFilters();
  }
  
  // Called whenever any filter changes
  updateFilters(): void {
    // If we have a current category, don't allow changing it from filters
    if (this.currentCategory) {
      this.filters.categories = [this.currentCategory];
    }
    
    this.filterChange.emit({ ...this.filters });
  }
  
  // Reset all filters to default values
  resetFilters(): void {
    this.filters = {
      categories: this.currentCategory ? [this.currentCategory] : [],
      subCategories: [],
      priceRange: { min: 0, max: 1000 },
      colors: [],
      sizes: [],
      tags: [],
      sortBy: 'newest'
    };
    this.updateFilters();
  }
} 