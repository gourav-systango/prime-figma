export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  subCategory: string;
  imageUrl: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
}

export interface ProductFilters {
  categories: string[];
  subCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  colors: string[];
  sizes: string[];
  tags: string[];
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
} 