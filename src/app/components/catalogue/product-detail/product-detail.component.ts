import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingModule, FormsModule, ToastModule],
  templateUrl: './product-detail.component.html',
  providers: [MessageService],
  styles: []
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity: number = 1;
  selectedColor?: string;
  selectedSize?: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.productService.getProductById(productId).subscribe(product => {
          this.product = product;
          // Set default selected color and size if available
          if (this.product && this.product.colors.length > 0) {
            this.selectedColor = this.product.colors[0];
          }
          if (this.product && this.product.sizes.length > 0) {
            this.selectedSize = this.product.sizes[0];
          }
        });
      }
    });
  }
  
  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
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

  addToWishlist(): void {
    // Wishlist functionality can be implemented similarly
    this.messageService.add({
      severity: 'info',
      summary: 'Added to Wishlist',
      detail: 'Product has been added to your wishlist.'
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
} 