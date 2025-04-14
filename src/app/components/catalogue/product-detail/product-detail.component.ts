import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { FavouritesService } from '../../../services/favourites.service';
import { AuthService } from '../../../services/auth.service';
import { AuthModalService } from '../../../services/auth-modal.service';
import { Product } from '../../../interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingModule, FormsModule, ToastModule, ConfirmDialogModule],
  templateUrl: './product-detail.component.html',
  providers: [MessageService, ConfirmationService],
  styles: []
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity: number = 1;
  selectedColor?: string;
  selectedSize?: string;
  isInWishlist: boolean = false;
  isInFavourites: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private favouritesService: FavouritesService,
    private authService: AuthService,
    private authModalService: AuthModalService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }
  
  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      if (product) {
        if (product.colors && product.colors.length > 0) {
          this.selectedColor = product.colors[0];
        }
        if (product.sizes && product.sizes.length > 0) {
          this.selectedSize = product.sizes[0];
        }
        this.isInWishlist = this.wishlistService.isInWishlist(product.id);
        this.isInFavourites = this.favouritesService.isInFavourites(product.id);
      }
    });
  }
  
  selectColor(color: string): void {
    this.selectedColor = color;
  }
  
  selectSize(size: string): void {
    this.selectedSize = size;
  }
  
  increaseQuantity(): void {
    this.quantity++;
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }
  
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
      this.messageService.add({
        severity: 'success',
        summary: 'Added to Cart',
        detail: `${this.product.name} has been added to your cart.`
      });
    }
  }
  
  buyNow(): void {
    if (!this.product) return;
    
    // First add the product to cart
    this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
    
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
  
  toggleWishlist(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to save items to your wishlist'
      });
      return;
    }
    
    this.wishlistService.toggleWishlistItem(this.product);
    this.isInWishlist = !this.isInWishlist;
    
    this.messageService.add({
      severity: this.isInWishlist ? 'success' : 'info',
      summary: this.isInWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
      detail: this.isInWishlist ? 
        `${this.product.name} has been added to your wishlist for later purchase.` : 
        `${this.product.name} has been removed from your wishlist.`
    });
  }
  
  toggleFavourites(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to add items to your favourites'
      });
      return;
    }
    
    this.favouritesService.toggleFavouriteItem(this.product);
    this.isInFavourites = !this.isInFavourites;
    
    this.messageService.add({
      severity: this.isInFavourites ? 'success' : 'info',
      summary: this.isInFavourites ? 'Added to Favourites' : 'Removed from Favourites',
      detail: this.isInFavourites ? 
        `${this.product.name} has been added to your favourites.` : 
        `${this.product.name} has been removed from your favourites.`
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
} 