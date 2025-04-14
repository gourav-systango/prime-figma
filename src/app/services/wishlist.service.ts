import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<Product[]>([]);
  private storageName = 'wishlist_items';

  constructor() {
    // Load wishlist from localStorage on service initialization
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const storedItems = localStorage.getItem(this.storageName);
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems);
        this.wishlistItems.next(items);
      } catch (error) {
        console.error('Error parsing wishlist from localStorage', error);
        // Reset localStorage if there's an error
        localStorage.removeItem(this.storageName);
      }
    }
  }

  private saveWishlist(items: Product[]): void {
    localStorage.setItem(this.storageName, JSON.stringify(items));
    this.wishlistItems.next(items);
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistItems.asObservable();
  }

  getWishlistItemsCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.wishlistItems.subscribe(items => {
        observer.next(items.length);
      });
    });
  }

  isInWishlist(productId: string): boolean {
    const items = this.wishlistItems.getValue();
    return items.some(item => item.id === productId);
  }

  addToWishlist(product: Product): void {
    const currentItems = this.wishlistItems.getValue();
    
    // Check if product is already in wishlist
    if (!this.isInWishlist(product.id)) {
      const updatedItems = [...currentItems, product];
      this.saveWishlist(updatedItems);
    }
  }

  removeFromWishlist(productId: string): void {
    const currentItems = this.wishlistItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.saveWishlist(updatedItems);
  }

  toggleWishlistItem(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  clearWishlist(): void {
    localStorage.removeItem(this.storageName);
    this.wishlistItems.next([]);
  }
} 