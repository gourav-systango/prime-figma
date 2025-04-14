import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  color?: string;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([
    // Mock cart items
    {
      id: '1',
      productId: '1',
      name: 'Classic Leather Watch',
      price: 199.99,
      quantity: 1,
      imageUrl: 'assets/images/products/product1.jpg',
    },
    {
      id: '2',
      productId: '3',
      name: 'Stonewash Jeans & Boots Combo',
      price: 189.99,
      quantity: 2,
      imageUrl: 'assets/images/products/product3.jpg',
      size: 'M'
    }
  ]);

  constructor() { }

  // Get all cart items
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  // Get cart items count
  getCartItemsCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  // Get cart total
  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }

  // Add item to cart
  addToCart(product: Product, quantity: number = 1, selectedColor?: string, selectedSize?: string): void {
    const currentItems = this.cartItems.getValue();
    
    // Check if product is already in cart
    const existingItemIndex = currentItems.findIndex(
      item => item.productId === product.id && 
              (selectedColor ? item.color === selectedColor : true) && 
              (selectedSize ? item.size === selectedSize : true)
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.next(updatedItems);
    } else {
      // Add new product to cart
      const newItem: CartItem = {
        id: Date.now().toString(), // Generate unique ID
        productId: product.id,
        name: product.name,
        price: product.discountedPrice || product.price,
        quantity: quantity,
        imageUrl: product.imageUrl || `assets/images/products/product${parseInt(product.id) % 4 + 1}.jpg`,
        color: selectedColor,
        size: selectedSize
      };
      
      this.cartItems.next([...currentItems, newItem]);
    }
  }

  // Remove item from cart
  removeFromCart(itemId: string): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
  }

  // Update item quantity
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    this.cartItems.next(updatedItems);
  }

  // Update cart item options like color and size
  updateCartItemOptions(itemId: string, color?: string, size?: string): void {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId) {
        return { 
          ...item, 
          color: color !== undefined ? color : item.color,
          size: size !== undefined ? size : item.size
        };
      }
      return item;
    });
    
    this.cartItems.next(updatedItems);
  }

  // Clear cart
  clearCart(): void {
    this.cartItems.next([]);
  }
} 