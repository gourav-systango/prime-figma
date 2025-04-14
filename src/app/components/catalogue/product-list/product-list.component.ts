import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { FavouritesService } from '../../../services/favourites.service';
import { AuthService } from '../../../services/auth.service';
import { AuthModalService } from '../../../services/auth-modal.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    RatingModule, 
    FormsModule, 
    ToastModule, 
    OverlayPanelModule,
    DialogModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[] = [];
  
  // Readonly rating for display
  readonly = true;
  
  // Track which products are in the wishlist and favorites
  wishlistProductIds: Set<string> = new Set<string>();
  favouriteProductIds: Set<string> = new Set<string>();
  
  // Size selection
  selectedSizes: { [productId: string]: string } = {};
  selectedColors: { [productId: string]: string } = {};
  
  // For size dialog
  showSizeDialog = false;
  currentProduct?: Product;
  selectedSize?: string;
  selectedColor?: string;
  
  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private favouritesService: FavouritesService,
    private authService: AuthService,
    private authModalService: AuthModalService,
    private messageService: MessageService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadWishlistItems();
    this.loadFavouriteItems();
  }
  
  loadWishlistItems(): void {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistProductIds = new Set(items.map(item => item.id));
    });
  }
  
  loadFavouriteItems(): void {
    this.favouritesService.getFavouriteItems().subscribe(items => {
      this.favouriteProductIds = new Set(items.map(item => item.id));
    });
  }
  
  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds.has(productId);
  }
  
  isInFavourites(productId: string): boolean {
    return this.favouriteProductIds.has(productId);
  }
  
  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }
  
  toggleWishlist(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to save items to your wishlist'
      });
      return;
    }
    
    this.wishlistService.toggleWishlistItem(product);
    const isNowInWishlist = !this.isInWishlist(product.id);
    
    // Update local tracking
    if (isNowInWishlist) {
      this.wishlistProductIds.add(product.id);
    } else {
      this.wishlistProductIds.delete(product.id);
    }
    
    this.messageService.add({
      severity: isNowInWishlist ? 'success' : 'info',
      summary: isNowInWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
      detail: isNowInWishlist ? 
        `${product.name} has been added to your wishlist for later purchase.` : 
        `${product.name} has been removed from your wishlist.`
    });
  }
  
  toggleFavourites(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to add items to your favourites'
      });
      return;
    }
    
    this.favouritesService.toggleFavouriteItem(product);
    const isNowInFavourites = !this.isInFavourites(product.id);
    
    // Update local tracking
    if (isNowInFavourites) {
      this.favouriteProductIds.add(product.id);
    } else {
      this.favouriteProductIds.delete(product.id);
    }
    
    this.messageService.add({
      severity: isNowInFavourites ? 'success' : 'info',
      summary: isNowInFavourites ? 'Added to Favourites' : 'Removed from Favourites',
      detail: isNowInFavourites ? 
        `${product.name} has been added to your favourites.` : 
        `${product.name} has been removed from your favourites.`
    });
  }
  
  openSizeDialog(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.currentProduct = product;
    
    // Set default selections if product has colors/sizes
    if (product.sizes.length > 0) {
      this.selectedSize = this.selectedSizes[product.id] || product.sizes[0];
    } else {
      this.selectedSize = undefined;
    }
    
    if (product.colors.length > 0) {
      this.selectedColor = this.selectedColors[product.id] || product.colors[0];
    } else {
      this.selectedColor = undefined;
    }
    
    this.showSizeDialog = true;
  }
  
  selectSize(size: string): void {
    this.selectedSize = size;
    if (this.currentProduct) {
      this.selectedSizes[this.currentProduct.id] = size;
    }
  }
  
  selectColor(color: string): void {
    this.selectedColor = color;
    if (this.currentProduct) {
      this.selectedColors[this.currentProduct.id] = color;
    }
  }
  
  addToCartWithOptions(): void {
    if (!this.currentProduct) return;
    
    this.cartService.addToCart(
      this.currentProduct, 
      1, 
      this.selectedColor, 
      this.selectedSize
    );
    
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${this.currentProduct.name} has been added to your cart.`
    });
    
    this.showSizeDialog = false;
  }
  
  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (product.sizes.length > 0 || product.colors.length > 0) {
      this.openSizeDialog(product, event);
      return;
    }
    
    this.cartService.addToCart(product);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.name} has been added to your cart.`
    });
  }
  
  buyNow(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (product.sizes.length > 0 || product.colors.length > 0) {
      // We need to select options first
      this.currentProduct = product;
      this.openSizeDialog(product, event);
      return;
    }
    
    // Add the product to cart
    this.cartService.addToCart(product);
    
    // Show a brief confirmation message
    this.messageService.add({
      severity: 'success',
      summary: 'Processing',
      detail: 'Taking you to checkout...'
    });
    
    // Navigate to checkout page
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 500);
  }
  
  buyNowWithOptions(): void {
    if (!this.currentProduct) return;
    
    // Add to cart with selected options
    this.cartService.addToCart(
      this.currentProduct, 
      1, 
      this.selectedColor, 
      this.selectedSize
    );
    
    // Show a brief confirmation message
    this.messageService.add({
      severity: 'success',
      summary: 'Processing',
      detail: 'Taking you to checkout...'
    });
    
    // Close dialog
    this.showSizeDialog = false;
    
    // Navigate to checkout page
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 500);
  }
} 