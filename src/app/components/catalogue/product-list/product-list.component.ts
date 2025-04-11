import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  
  // Readonly rating for display
  readonly = true;
  
  constructor(
    private cartService: CartService,
    private messageService: MessageService
  ) {}
  
  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }
  
  addToWishlist(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Wishlist functionality can be implemented later
    this.messageService.add({
      severity: 'info',
      summary: 'Added to Wishlist',
      detail: 'Product has been added to your wishlist.'
    });
  }
  
  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.cartService.addToCart(product);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.name} has been added to your cart.`
    });
  }
} 