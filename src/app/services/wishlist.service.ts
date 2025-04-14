import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<Product[]>([]);
  private storageName = 'wishlist_items';

  constructor(private authService: AuthService) {
    // Load wishlist from localStorage on service initialization
    this.loadWishlist();
    
    // Subscribe to auth state changes to reload or clear wishlist when login/logout occurs
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadWishlist();
      } else {
        this.wishlistItems.next([]);
      }
    });
  }

  private loadWishlist(): void {
    // Only load if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.wishlistItems.next([]);
      return;
    }
    
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
    // Only save if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    localStorage.setItem(this.storageName, JSON.stringify(items));
    this.wishlistItems.next(items);
  }

  getWishlistItems(): Observable<Product[]> {
    // Only return items if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }
    return this.wishlistItems.asObservable();
  }

  getWishlistItemsCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getWishlistItems().subscribe(items => {
        observer.next(items.length);
      });
    });
  }

  isInWishlist(productId: string): boolean {
    // If not authenticated, nothing is in wishlist
    if (!this.authService.isAuthenticated()) {
      return false;
    }
    const items = this.wishlistItems.getValue();
    return items.some(item => item.id === productId);
  }

  addToWishlist(product: Product): void {
    // Only add if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    const currentItems = this.wishlistItems.getValue();
    
    // Check if product is already in wishlist
    if (!this.isInWishlist(product.id)) {
      const updatedItems = [...currentItems, product];
      this.saveWishlist(updatedItems);
    }
  }

  removeFromWishlist(productId: string): void {
    // Only remove if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    const currentItems = this.wishlistItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.saveWishlist(updatedItems);
  }

  toggleWishlistItem(product: Product): void {
    // Only toggle if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
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