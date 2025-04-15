import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

interface SizeOption {
  label: string;
  value: string;
}

interface ColorOption {
  label: string;
  value: string;
  style: { [key: string]: string };
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ToastModule, 
    ConfirmDialogModule,
    DropdownModule
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
  
  // Maps to store product details for cart items
  productMap: Map<string, Product> = new Map();
  sizeOptionsMap: Map<string, SizeOption[]> = new Map();
  colorOptionsMap: Map<string, ColorOption[]> = new Map();

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
      this.loadProductDetails();
    });
  }

  // Load product details for all cart items to get available options
  loadProductDetails(): void {
    // Create a set of unique product IDs
    const productIds = new Set(this.cartItems.map(item => item.productId));
    
    // Fetch each product's details
    productIds.forEach(productId => {
      this.productService.getProductById(productId).subscribe(product => {
        if (product) {
          this.productMap.set(productId, product);
          
          // Prepare size options
          if (product.sizes && product.sizes.length > 0) {
            const sizeOptions: SizeOption[] = product.sizes.map(size => ({
              label: size,
              value: size
            }));
            this.sizeOptionsMap.set(productId, sizeOptions);
          }
          
          // Prepare color options
          if (product.colors && product.colors.length > 0) {
            const colorOptions: ColorOption[] = product.colors.map(color => ({
              label: this.formatColorName(color),
              value: color,
              style: { 'background-color': color, 'width': '20px', 'height': '20px', 'display': 'inline-block', 'border-radius': '50%', 'margin-right': '5px' }
            }));
            this.colorOptionsMap.set(productId, colorOptions);
          }
        }
      });
    });
  }
  
  // Helper function to format color names
  formatColorName(color: string): string {
    // Convert hex or rgb colors to more readable names
    // This is a simple implementation
    const colorMap: {[key: string]: string} = {
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FFC0CB': 'Pink',
      '#800080': 'Purple',
      '#FFA500': 'Orange',
      '#A52A2A': 'Brown',
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#808080': 'Gray'
    };
    
    return colorMap[color.toUpperCase()] || this.capitalize(color);
  }
  
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  confirmRemoveItem(item: CartItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${item.name} from your cart?`,
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeItem(item.id);
      }
    });
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
    this.messageService.add({
      severity: 'success',
      summary: 'Item Removed',
      detail: 'The item has been removed from your cart'
    });
  }

  confirmClearCart(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove all items from your cart?',
      header: 'Clear Cart',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clearCart();
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.messageService.add({
      severity: 'info',
      summary: 'Cart Cleared',
      detail: 'All items have been removed from your cart'
    });
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value);
    
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(item.id, quantity);
      this.messageService.add({
        severity: 'success',
        summary: 'Quantity Updated',
        detail: `Quantity updated to ${quantity}`
      });
    }
  }
  
  updateSize(item: CartItem, size: string): void {
    const currentItems = this.cartItems;
    const productId = item.productId;
    
    // Check if this combination already exists in cart
    const existingItemWithSize = currentItems.find(
      i => i.productId === productId && 
           i.size === size && 
           i.color === item.color &&
           i.id !== item.id
    );
    
    if (existingItemWithSize) {
      // Merge quantities by adding to existing item and removing this one
      this.cartService.updateQuantity(existingItemWithSize.id, existingItemWithSize.quantity + item.quantity);
      this.cartService.removeFromCart(item.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Items Combined',
        detail: `Items with the same specifications have been combined`
      });
    } else {
      // Update the cart item with the new size
      this.cartService.updateItemSize(item.id, size);
      this.messageService.add({
        severity: 'success',
        summary: 'Size Updated',
        detail: `Size updated to ${size}`
      });
    }
  }
  
  updateColor(item: CartItem, color: string): void {
    const currentItems = this.cartItems;
    const productId = item.productId;
    
    // Check if this combination already exists in cart
    const existingItemWithColor = currentItems.find(
      i => i.productId === productId && 
           i.color === color && 
           i.size === item.size &&
           i.id !== item.id
    );
    
    if (existingItemWithColor) {
      // Merge quantities
      this.cartService.updateQuantity(existingItemWithColor.id, existingItemWithColor.quantity + item.quantity);
      this.cartService.removeFromCart(item.id);
      this.messageService.add({
        severity: 'success',
        summary: 'Items Combined',
        detail: `Items with the same specifications have been combined`
      });
    } else {
      // Update the cart item with the new color
      this.cartService.updateItemColor(item.id, color);
      this.messageService.add({
        severity: 'success',
        summary: 'Color Updated',
        detail: `Color updated to ${this.formatColorName(color)}`
      });
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
  
  getSizeOptions(productId: string): SizeOption[] {
    return this.sizeOptionsMap.get(productId) || [];
  }
  
  getColorOptions(productId: string): ColorOption[] {
    return this.colorOptionsMap.get(productId) || [];
  }
} 