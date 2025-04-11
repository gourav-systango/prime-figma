import { Component, EventEmitter, Output } from '@angular/core';
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
export class ProductFiltersComponent {
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
  
  // Category options
  categoryOptions: FilterOption[] = [
    { label: 'Women\'s Clothing', value: 'womens-clothing', count: 12 },
    { label: 'Men\'s Clothing', value: 'mens-clothing', count: 8 },
    { label: 'Kids Collection', value: 'kids-collection', count: 6 },
    { label: 'Accessories', value: 'accessories', count: 15 },
    { label: 'Footwear', value: 'footwear', count: 10 },
    { label: 'Sale Items', value: 'sale-items', count: 7 }
  ];
  
  // Subcategory options
  subCategoryOptions: FilterOption[] = [
    { label: 'T-Shirts', value: 't-shirts', count: 8 },
    { label: 'Shirts', value: 'shirts', count: 5 },
    { label: 'Dresses', value: 'dresses', count: 12 },
    { label: 'Jeans', value: 'jeans', count: 7 },
    { label: 'Jackets', value: 'jackets', count: 6 },
    { label: 'Suits', value: 'suits', count: 4 },
    { label: 'Watches', value: 'watches', count: 9 },
    { label: 'Boots', value: 'boots', count: 5 }
  ];
  
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
    this.filterChange.emit({ ...this.filters });
  }
  
  // Reset all filters to default values
  resetFilters(): void {
    this.filters = {
      categories: [],
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