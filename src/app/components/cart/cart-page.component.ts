import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart-page.component.html',
  styles: []
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  shippingCost: number = 0;
  tax: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value);
    
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(item.id, quantity);
    }
  }

  private calculateTotals(): void {
    // Calculate subtotal
    this.cartTotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over $100)
    this.shippingCost = this.cartTotal >= 100 ? 0 : 10;
    
    // Calculate tax (10%)
    this.tax = this.cartTotal * 0.1;
  }

  getOrderTotal(): number {
    return this.cartTotal + this.shippingCost + this.tax;
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
} 