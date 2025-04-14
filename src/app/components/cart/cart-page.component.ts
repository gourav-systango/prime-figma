import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ToastModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cart-page.component.html',
  styles: []
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  shippingCost: number = 0;
  tax: number = 0;
  
  // For editing item properties
  showEditDialog = false;
  editingItem?: CartItem;
  currentProduct?: Product;
  selectedSize?: string;
  selectedColor?: string;
  selectedQuantity: number = 1;
  availableSizes: string[] = [];
  availableColors: string[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item from your cart?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.removeFromCart(itemId);
        this.messageService.add({
          severity: 'success',
          summary: 'Item Removed',
          detail: 'The product has been removed from your cart'
        });
      }
    });
  }

  clearCart(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear your entire cart?',
      header: 'Confirm Clear Cart',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.clearCart();
        this.messageService.add({
          severity: 'info',
          summary: 'Cart Cleared',
          detail: 'All items have been removed from your cart'
        });
      }
    });
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value);
    
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(item.id, quantity);
    }
  }
  
  openEditDialog(item: CartItem): void {
    this.editingItem = item;
    this.selectedSize = item.size;
    this.selectedColor = item.color;
    this.selectedQuantity = item.quantity;
    
    // Get product details to show available sizes and colors
    this.productService.getProductById(item.productId).subscribe(product => {
      if (product) {
        this.currentProduct = product;
        this.availableSizes = product.sizes;
        this.availableColors = product.colors;
        this.showEditDialog = true;
      }
    });
  }
  
  selectSize(size: string): void {
    this.selectedSize = size;
  }
  
  selectColor(color: string): void {
    this.selectedColor = color;
  }
  
  saveItemChanges(): void {
    if (!this.editingItem) return;
    
    this.editingItem.size = this.selectedSize;
    this.editingItem.color = this.selectedColor;
    
    // If quantity changed, update it
    if (this.selectedQuantity !== this.editingItem.quantity) {
      this.cartService.updateQuantity(this.editingItem.id, this.selectedQuantity);
    }
    
    // Update the cart item with new options
    this.cartService.updateCartItemOptions(
      this.editingItem.id, 
      this.selectedColor, 
      this.selectedSize
    );
    
    this.messageService.add({
      severity: 'success',
      summary: 'Item Updated',
      detail: 'Your cart item has been updated successfully'
    });
    
    this.showEditDialog = false;
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