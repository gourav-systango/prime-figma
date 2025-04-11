import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductFilters } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock product data - in a real app, this would come from an API
  private products: Product[] = [
    {
      id: '1',
      name: 'Classic Leather Watch',
      description: 'Elegant timepiece with genuine leather strap and stainless steel case',
      price: 199.99,
      category: 'accessories',
      subCategory: 'watches',
      imageUrl: 'images/products/product1.jpg',
      colors: ['#000000', '#8B4513', '#A52A2A'],
      sizes: [],
      tags: ['luxury', 'formal', 'business'],
      rating: 4.5,
      reviewCount: 124,
      isNew: true,
      isFeatured: true,
      isOnSale: false
    },
    {
      id: '2',
      name: 'Gold & Leather Luxury Watch',
      description: 'Premium gold-toned watch with brown leather strap, perfect for special occasions',
      price: 299.99,
      discountedPrice: 249.99,
      category: 'accessories',
      subCategory: 'watches',
      imageUrl: 'images/products/product2.jpg',
      colors: ['#8B4513'],
      sizes: [],
      tags: ['luxury', 'premium', 'gift'],
      rating: 4.8,
      reviewCount: 86,
      isNew: false,
      isFeatured: true,
      isOnSale: true
    },
    {
      id: '3',
      name: 'Stonewash Jeans & Boots Combo',
      description: 'Stylish stonewash jeans paired with genuine leather boots for a classic look',
      price: 189.99,
      category: 'mens-clothing',
      subCategory: 'jeans',
      imageUrl: 'images/products/product3.jpg',
      colors: ['#4169E1'],
      sizes: ['S', 'M', 'L', 'XL'],
      tags: ['casual', 'denim', 'streetwear'],
      rating: 4.3,
      reviewCount: 57,
      isNew: true,
      isFeatured: false,
      isOnSale: false
    },
    {
      id: '4',
      name: 'Business Casual Outfit',
      description: 'Complete business casual outfit featuring tailored shirt, suit jacket and tie',
      price: 349.99,
      discountedPrice: 299.99,
      category: 'mens-clothing',
      subCategory: 'suits',
      imageUrl: 'images/products/product4.jpg',
      colors: ['#000000', '#1F1F1F'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      tags: ['business', 'formal', 'office'],
      rating: 4.6,
      reviewCount: 42,
      isNew: false,
      isFeatured: true,
      isOnSale: true
    },
    {
      id: '5',
      name: 'Summer Floral Dress',
      description: 'Light and breezy floral print dress, perfect for summer days',
      price: 79.99,
      category: 'womens-clothing',
      subCategory: 'dresses',
      imageUrl: 'images/products/product1.jpg',
      colors: ['#FFB6C1', '#87CEFA'],
      sizes: ['XS', 'S', 'M', 'L'],
      tags: ['summer', 'casual', 'floral'],
      rating: 4.4,
      reviewCount: 78,
      isNew: true,
      isFeatured: true,
      isOnSale: false
    },
    {
      id: '6',
      name: 'Kids Casual T-Shirt Set',
      description: 'Comfortable cotton t-shirts in bright colors for kids',
      price: 39.99,
      category: 'kids-collection',
      subCategory: 't-shirts',
      imageUrl: 'images/products/product2.jpg',
      colors: ['#FF5733', '#33FF57', '#3357FF'],
      sizes: ['3-4Y', '5-6Y', '7-8Y'],
      tags: ['kids', 'casual', 'comfortable'],
      rating: 4.7,
      reviewCount: 34,
      isNew: false,
      isFeatured: false,
      isOnSale: false
    },
    {
      id: '7',
      name: 'Leather Ankle Boots',
      description: 'Stylish ankle boots with genuine leather and non-slip sole',
      price: 149.99,
      category: 'footwear',
      subCategory: 'boots',
      imageUrl: 'images/products/product3.jpg',
      colors: ['#000000', '#8B4513'],
      sizes: ['36', '37', '38', '39', '40', '41'],
      tags: ['winter', 'leather', 'comfortable'],
      rating: 4.2,
      reviewCount: 56,
      isNew: false,
      isFeatured: true,
      isOnSale: false
    },
    {
      id: '8',
      name: 'Clearance: Winter Jacket',
      description: 'Warm padded winter jacket with faux fur hood - limited stock',
      price: 199.99,
      discountedPrice: 99.99,
      category: 'sale-items',
      subCategory: 'outerwear',
      imageUrl: 'images/products/product4.jpg',
      colors: ['#000000', '#1F1F1F', '#808080'],
      sizes: ['S', 'M', 'XL'],
      tags: ['winter', 'clearance', 'sale'],
      rating: 4.1,
      reviewCount: 28,
      isNew: false,
      isFeatured: false,
      isOnSale: true
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
    return of(filteredProducts);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getFilteredProducts(filters: ProductFilters): Observable<Product[]> {
    let filteredProducts = [...this.products];
    
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Filter by subcategories
    if (filters.subCategories && filters.subCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.subCategories.includes(product.subCategory)
      );
    }
    
    // Filter by price range
    if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < Number.MAX_VALUE)) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.discountedPrice || product.price;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }
    
    // Filter by colors
    if (filters.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.colors.some(color => filters.colors.includes(color))
      );
    }
    
    // Filter by sizes
    if (filters.sizes && filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Sort products
    if (filters.sortBy) {
      filteredProducts = this.sortProducts(filteredProducts, filters.sortBy);
    }
    
    return of(filteredProducts);
  }
  
  private sortProducts(products: Product[], sortBy: string): Product[] {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => 
          (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
        );
      case 'price-desc':
        return [...products].sort((a, b) => 
          (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
        );
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
      default:
        return products;
    }
  }
} 